import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const getUserWithoutPassword = (userInstance) => {
  if (!userInstance || typeof userInstance.toJSON !== "function") {
    throw new Error("Invalid Sequelize user instance");
  }

  const user = userInstance.toJSON();
  delete user.password;
  return user;
};

export const strongPasswd = (passwd) => {
  if (passwd.length < 6) {
    return false;
  }

  const contientLettre = /[a-zA-Z]/.test(passwd);
  const contientChiffre = /[0-9]/.test(passwd);
  const contientSpecial = /[^\w\s]/.test(passwd);

  return contientLettre && contientChiffre && contientSpecial;
};

export const formatDateForUser = (isoDateString) => {
  const date = new Date(isoDateString);

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
};
