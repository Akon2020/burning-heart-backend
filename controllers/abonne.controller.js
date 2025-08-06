import { EMAIL, FRONT_URL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { valideEmail } from "../middlewares/email.middleware.js";
import { Abonne } from "../models/index.model.js";
import { newsletterSubscriptionConfirmationTemplate } from "../utils/email.template.js";

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { nomComplet, email } = req.body;

    if (!nomComplet || !email) {
      return res.status(404).json({
        message: "Vous devez remplir les champs obligatoires!",
      });
    }

    if (!valideEmail(email)) {
      return res.status(400).json({ message: "Adresse email invalide" });
    }

    const nouveauAbonne = await Abonne.create({
      nomComplet,
      email,
      statut: "actif",
      dateAbonnement: new Date(),
      dateDesabonnement: null,
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Confirmation d'abonnement à la newsletter",
      html: newsletterSubscriptionConfirmationTemplate (
        nouveauAbonne.nomComplet,
        `${FRONT_URL}/blog`
      ),
    };

    await transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          message:
            "Erreur lors de l'envoi de l'accusé de reception mais vous avez été bien abonné",
        });
      }
    });

    return res.status(201).json({
      message: `${nouveauAbonne.nomComplet}, Votre abonnement a été envoyé avec succès\nTrouvez une accusée de reception dans votre boîte mail`,
      data: nouveauAbonne,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};