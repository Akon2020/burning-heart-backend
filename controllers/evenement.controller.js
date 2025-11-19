import { Op, fn, col } from "sequelize";
import {
  Abonne,
  Evenement,
  Utilisateur,
  InscriptionEvenement,
} from "../models/index.model.js";
import { EMAIL, FRONT_URL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { eventPublishedNotificationTemplate } from "../utils/email.template.js";

const requiredFields = [
  "titre",
  "description",
  "dateEvenement",
  "heureDebut",
  "heureFin",
  "lieu",
];

const hasMissingFields = (obj) =>
  requiredFields.some(
    (field) => !obj[field] || obj[field].toString().trim() === ""
  );

export const getAllEvents = async (req, res, next) => {
  try {
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    const { count, rows: events } = await Evenement.findAndCountAll({
      where: { statut: "publie" },
      include: [
        {
          model: Utilisateur,
          as: "createur",
          attributes: ["idUtilisateur", "nomComplet", "email"],
        },
        {
          model: InscriptionEvenement,
          as: "inscriptions",
          attributes: ["idInscription"],
        },
      ],
      order: [
        ["dateEvenement", "ASC"],
        ["heureDebut", "ASC"],
      ],
      distinct: true,
      limit,
      offset: (page - 1) * limit,
    });

    const eventsWithCount = events.map((event) => {
      const data = event.toJSON();
      data.nombreInscrits = data.inscriptions?.length || 0;
      delete data.inscriptions;
      return data;
    });

    res.status(200).json({
      total: count,
      page,
      pageSize: limit,
      events: eventsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEventsAdmin = async (req, res, next) => {
  try {
    const {
      statut,
      q, // recherche plein‑texte sur titre|description|lieu
      startDate,
      endDate,
      limit = 20,
      page = 1,
    } = req.query;

    const filters = {};
    if (statut) filters.statut = statut;
    if (startDate || endDate)
      filters.dateEvenement = {
        ...(startDate && { [Op.gte]: startDate }),
        ...(endDate && { [Op.lte]: endDate }),
      };
    if (q)
      filters[Op.or] = [
        { titre: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { lieu: { [Op.iLike]: `%${q}%` } },
      ];

    const { count, rows: events } = await Evenement.findAndCountAll({
      where: filters,
      include: [
        {
          model: Utilisateur,
          as: "createur",
          attributes: ["idUtilisateur", "nomComplet", "email"],
        },
      ],
      order: [
        ["dateEvenement", "DESC"],
        ["heureDebut", "DESC"],
      ],
      limit: +limit,
      offset: (+page - 1) * +limit,
    });

    res
      .status(200)
      .json({ total: count, page: +page, pageSize: +limit, events });
  } catch (error) {
    next(error);
  }
};

export const getSingleEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Evenement.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: "createur",
          attributes: ["idUtilisateur", "nomComplet", "email"],
        },
        {
          model: InscriptionEvenement,
          as: "inscriptions",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [fn("COUNT", col("inscriptions.idInscription")), "nombreInscrits"],
        ],
      },
      distinct: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.status(200).json({ event });
  } catch (error) {
    next(error);
  }
};

export const getEventsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const events = await Evenement.findAll({
      where: { dateEvenement: date, statut: "publie" },
      order: [["heureDebut", "ASC"]],
    });

    res.status(200).json({ total: events.length, events });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    if (hasMissingFields(req.body))
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis.",
      });

    const {
      titre,
      description,
      dateEvenement,
      heureDebut,
      heureFin,
      lieu,
      nombrePlaces = 100,
      statut,
    } = req.body;

    const existing = await Evenement.findOne({
      where: {
        [Op.and]: [{ titre }, { dateEvenement }, { lieu }],
      },
    });
    if (existing)
      return res.status(409).json({ message: "Événement déjà existant." });

    const imageEvenement = req.file
      ? req.file.path
      : "https://placehold.co/600x400?text=Image+Evenement";
    const createdBy = req.user?.idUtilisateur;

    const newEvent = await Evenement.create({
      titre,
      description,
      dateEvenement,
      heureDebut,
      heureFin,
      lieu,
      nombrePlaces,
      imageEvenement,
      statut: statut || "brouillon",
      createdBy,
    });

    if (newEvent.statut === "publie") {
      const abonnes = await Abonne.findAll({
        where: { statut: "actif" },
        attributes: ["email", "nomComplet"],
      });

      for (const abonne of abonnes) {
        let mailEnvoye = true;
        try {
          const mailOptions = {
            from: `"BurningHeart IHS" <${EMAIL}>`,
            to: abonne.email,
            subject: `📢 Nouvel événement publié : ${newEvent.titre}`,
            html: eventPublishedNotificationTemplate(
              abonne.nomComplet,
              newEvent.titre,
              newEvent.dateEvenement,
              newEvent.lieu,
              `${FRONT_URL}/evenements/${newEvent.idEvenement}`
            ),
          };

          await transporter.sendMail(mailOptions);
        } catch (mailError) {
          console.error(
            `Erreur d'envoi email à ${abonne.email} →`,
            mailError.message
          );
          mailEnvoye = false;
        }

        if (!mailEnvoye) {
          return res.status(201).json({
            mailSend: "La notification n'a pas été envoyé aux abonnées",
            message: `L'événement “${newEvent.titre}” a été créé avec succès.`,
            data: newEvent,
          });
        }
      }
    }

    res.status(201).json({
      mailSend: "La notification a été envoyé aux abonnées",
      message: `L'événement “${newEvent.titre}” a été créé avec succès.`,
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Evenement.findByPk(id);
    if (!event)
      return res.status(404).json({ message: "Événement non trouvé." });

    const updatableFields = [
      "titre",
      "description",
      "dateEvenement",
      "heureDebut",
      "heureFin",
      "lieu",
      "nombrePlaces",
      "statut",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    if (req.file) event.imageEvenement = req.file.path;

    await event.save();

    res.status(200).json({
      message: `Événement “${event.titre}” mis à jour avec succès.`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Evenement.findByPk(id);
    if (!event)
      return res.status(404).json({ message: "Événement non trouvé." });

    event.statut = "annule";
    await event.save();

    res.status(200).json({
      message: `Événement “${event.titre}” annulé/supprimé avec succès.`,
    });
  } catch (error) {
    next(error);
  }
};

/* import { Evenement } from "../models/index.model.js";
import { Op } from "sequelize";

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Evenement.findAll({ where: { statut: "publie" } });
    return res.status(200).json({ total: events.length, events });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getAllEventsAdmin = async (req, res, next) => {
  try {
    const events = await Evenement.findAll({ order: [["ordre", "ASC"]] });
    return res.status(200).json({ total: events.length, events });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Evenement.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getEventsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const events = await Evenement.findAll({
      where: {
        dateEvenement: date,
        statut: "publie",
      },
    });

    return res.status(200).json({ total: events.length, events });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const {
      titre,
      description,
      dateEvenement,
      heureDebut,
      heureFin,
      lieu,
      nombrePlaces,
      statut,
    } = req.body;
    const imageEvenement = req.file
      ? req.file.path
      : "https://placehold.co/600x400?text=Image+Evenement";
    const createdBy = req.user?.idUtilisateur;
    if ((titre, description, dateEvenement, heureDebut, heureFin, lieu)) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tout les champs obligatoires" });
    }

    const existing = await Evenement.findOne({
      where: {
        [Op]: [{ titre }, { description }, { dateEvenement }, { lieu }],
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Un événement similaire existe déjà.",
      });
    }

    const newEvent = await Evenement.create({
      titre,
      description,
      dateEvenement,
      heureDebut,
      heureFin,
      lieu,
      nombrePlaces: nombrePlaces || 100,
      imageEvenement,
      createdBy,
      statut: statut || "publie",
    });

    return res.status(201).json({
      message: `L'événement ${titre} a été crée avec succès`,
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = [
      "titre",
      "description",
      "dateEvenement",
      "heureDebut",
      "heureFin",
      "lieu",
      "nombrePlaces",
      "statut",
      "imageEvenement",
    ];
    const donneesAMettreAJour = {};

    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    if (req.file) {
      donneesAMettreAJour.imageEvenement = req.file.path;
    }


    const event = await Evenement.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Evenement non trouvé" });
    }

    await event.update(donneesAMettreAJour);

    const eventMisAJour = await Evenement.findByPk(id);

    return res.status(200).json({
      message: `L'événement "${event.titre}" mis à jour avec succès.`,
      event: eventMisAJour,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Evenement.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Evénement non trouvé" });
    }

    await event.destroy();

    return res
      .status(200)
      .json({ message: `Evénement "${event.titre}" supprimé avec succès.` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
}; */
