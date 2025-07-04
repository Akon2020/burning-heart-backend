import { Equipe } from "../models/index.model.js";
import { Op } from "sequelize";

export const getAllEquipes = async (req, res, next) => {
  try {
    const equipes = await Equipe.findAll({ order: [["ordre", "ASC"]] });
    return res.status(200).json({ total: equipes.length, equipes });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleEquipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipe = await Equipe.findByPk(id);

    if (!equipe) {
      return res.status(404).json({ message: "Membre non trouvé" });
    }

    return res.status(200).json({ equipe });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getEquipeByFonction = async (req, res, next) => {
  try {
    const { fonction } = req.params;
    const equipe = await Equipe.findOne({ where: { fonction } });

    if (!equipe) {
      return res.status(404).json({ message: "Membre non trouvé" });
    }

    return res.status(200).json({ equipe });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createEquipe = async (req, res, next) => {
  try {
    const { nomComplet, fonction, biographie, ordre, actif } = req.body;
    const photoProfil = req.file ? req.file.path : null;

    if (!nomComplet || !fonction) {
      return res
        .status(400)
        .json({
          message: "Le nom et la fonction du membre de l'équipe' est requis.",
        });
    }

    const existing = await Equipe.findOne({ where: { nomComplet } });

    if (existing) {
      return res.status(400).json({
        message: "Un membre avec ce nom existe déjà.",
      });
    }

    let ordreFinal = ordre;

    if (ordre === undefined || isNaN(ordre)) {
      const maxOrdre = await Equipe.max("ordre");
      ordreFinal = (maxOrdre || 0) + 1;
    } else {
      await Equipe.increment("ordre", {
        where: {
          ordre: {
            [Op.gte]: ordre,
          },
        },
      });
      ordreFinal = Number(ordre);
    }

    const newEquipe = await Equipe.create({
      nomComplet,
      fonction,
      biographie,
      ordre: ordreFinal,
      actif,
      photoProfil,
    });

    return res.status(201).json({
      message: "Membre de l'équipe ajouté(e) avec succès",
      data: newEquipe,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateEquipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = [
      "nomComplet",
      "fonction",
      "biographie",
      "photoProfil",
      "ordre",
      "actif",
    ];
    const donneesAMettreAJour = {};

    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    if (req.file) {
      donneesAMettreAJour.photoProfil = req.file.path;
    }

    const equipe = await Equipe.findByPk(id);
    if (!equipe) {
      return res
        .status(404)
        .json({ message: "Ce membre n'est pas enregistré dans notre système" });
    }

    const nouvelOrdre = Number(donneesAMettreAJour.ordre);
    const ordreActuel = equipe.ordre;

    if (
      !isNaN(nouvelOrdre) &&
      nouvelOrdre !== undefined &&
      nouvelOrdre !== ordreActuel
    ) {
      await Equipe.increment("ordre", {
        where: {
          ordre: {
            [Op.gte]: nouvelOrdre,
          },
          id: {
            [Op.ne]: id,
          },
        },
      });
    } else {
      delete donneesAMettreAJour.ordre;
    }

    await equipe.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de ${equipe.nomComplet} ont été mises à jour avec succès`,
      data: equipe,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteEquipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipe = await Equipe.findByPk(id);

    if (!equipe) {
      return res.status(404).json({ message: "Membre non trouvé" });
    }

    await equipe.destroy();

    return res
      .status(200)
      .json({
        message: `Le membre ${equipe.nomComplet} a été supprimé(e) avec succès`,
      });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
