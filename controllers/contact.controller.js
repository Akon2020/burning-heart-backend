import { EMAIL, FRONT_URL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { valideEmail } from "../middlewares/email.middleware.js";
import { Contact } from "../models/index.model.js";
import { confirmationReceptionEmailTemplate, contactReplyEmailTemplate } from "../utils/email.template.js";
import { formatDateForUser } from "../utils/user.utils.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res
      .status(200)
      .json({ nombre: contacts.length, contactsInfo: contacts });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    return res.status(200).json({ contactInfo: contact });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getContactsByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const contacts = await Contact.findAll({
      where: { email },
      order: [["createdAt", "DESC"]],
    });

    return res
      .status(200)
      .json({ nombre: contacts.length, contactsInfo: contacts });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { nomComplet, email, sujet, message } = req.body;

    if (!nomComplet || !email || !sujet || !message) {
      return res.status(404).json({
        message: "Vous devez remplir les champs obligatoires!",
      });
    }

    if (!valideEmail(email)) {
      return res.status(400).json({ message: "Adresse email invalide" });
    }

    const nouveauContact = await Contact.create({
      nomComplet,
      email,
      sujet,
      message,
      statut: "nouveau",
      repondu: false,
      createdAt: new Date(),
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Confirmation de Réception de votre message",
      html: confirmationReceptionEmailTemplate(
        nouveauContact.nomComplet,
        sujet,
        FRONT_URL
      ),
    };

    await transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          message:
            "Erreur lors de l'envoi de l'accusé de reception mais votre message a été bien envoyé",
        });
      }
      console.log("Message envoyé et sauvegarder avec succès\nInformation");
    });

    return res.status(201).json({
      message: `${nouveauContact.nomComplet}, Votre message a été envoyé avec succès\nTrouvez une accusée de reception dans votre boîte mail`,
      data: nouveauContact,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const repondreContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sujetReponse, messageReponse } = req.body;

    if (!sujetReponse || !messageReponse) {
      return res.status(400).json({ message: "Sujet et message de réponse requis." });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact non trouvé." });
    }

    const mailOptions = {
      from: EMAIL,
      to: contact.email,
      subject: sujetReponse,
      html: contactReplyEmailTemplate(contact.nomComplet, sujetReponse, formatDateForUser(contact.createdAt), contact.sujet, messageReponse),
    };

    await transporter.sendMail(mailOptions);

    contact.repondu = true;
    contact.statut = "traite";
    await contact.save();

    return res.status(200).json({
      message: `Une réponse a été envoyée avec succès à ${contact.nomComplet}`,
      data: contact,
    });
  } catch (error) {
    console.error("Erreur lors de la réponse au contact :", error);
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};


export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    await contact.destroy();

    return res.status(200).json({
      message: `Un message de ${contact.nomComplet} vient d'être supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
