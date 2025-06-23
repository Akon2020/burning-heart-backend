import { Utilisateur } from "../models/index.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DEFAULT_PASSWD, EMAIL, HOST_URL, JWT_SECRET } from "../config/env.js";
import { generateToken, getUserWithoutPassword } from "../utils/user.utils.js";
import { resetPasswordEmailTemplate } from "../utils/email.template.js";
import transporter from "../config/nodemailer.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const isDefaultPassword = await bcrypt.compare(
      DEFAULT_PASSWD,
      user.password
    );

    if (isDefaultPassword) {
      return res.status(403).json({
        message:
          "Vous utilisez le mot de passe par défaut. Veuillez le modifier pour continuer.",
        requiresPasswordChange: true,
      });
    }
    const loginToken = generateToken(user);
    res.cookie("token", loginToken, { httpOnly: true, secure: true });

    const userWithoutPassword = getUserWithoutPassword(user);

    res.status(200).json({
      message: `Bienvenu ${userWithoutPassword.nomComplet} 👋`,
      data: { token: loginToken, userInfo: userWithoutPassword },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "L'email est requis" });
    }

    const user = await Utilisateur.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message:
          "Cet email n'est attaché à aucun compte! Veuillez vérifier votre email",
      });
    }
    const resetToken = generateToken(user);
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: resetPasswordEmailTemplate(
        user.firstName,
        email,
        HOST_URL,
        resetToken
      ),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message:
        "Un email de réinitialisation vous a été envoyé! Consultez votre boîte mail",
      dev: {
        resetUrl: `${HOST_URL}/auth/resetpassword?token=${resetToken}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de l'envoi de l'email de réinitialisation! Réessayez plus tard",
    });
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token et nouveau mot de passe requis" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    const user = await Utilisateur.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Utilisateur.update(
      { password: hashedPassword },
      { where: { idUtilisateur: user.idUtilisateur } }
    );

    res.status(200).json({
      message:
        "Mot de passe réinitialisé avec succès! Connectez-vous maintenant",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la réinitialisation du mot de passe" });
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
    });
  }
};
