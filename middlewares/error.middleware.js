import fs from "fs";
import { NODE_ENV } from "../config/env.js";
import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log" }),
  ],
});

const handleDatabaseError = (err, res) => {
  if (!res || typeof res.status !== "function") return;

  switch (err.code) {
    case "ER_ACCESS_DENIED_ERROR":
      return res
        .status(500)
        .json({ message: "Accès refusé à la base de données" });
    case "ER_BAD_DB_ERROR":
      return res.status(500).json({ message: "Base de données introuvable" });
    case "ER_PARSE_ERROR":
      return res
        .status(400)
        .json({ message: "La syntaxe de la requête est invalide" });
    case "'ERR_HTTP_HEADERS_SENT'":
      return res
        .status(400)
        .json({ message: "Vous êtes hors connexion pour envoyer ce mail" });
    case "ER_DUP_ENTRY":
      return res.status(409).json({ message: "Entrée dupliquée" });
    default:
      return res.status(500).json({ message: "Erreur de la base de données" });
  }
};

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error({
    time: `${new Date().toDateString()} | ${new Date().toLocaleTimeString()}`,
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  if (!res || typeof res.status !== "function") {
    console.error("Erreur critique : la réponse Express est invalide.");
    return next(err);
  }

  if (err.sql) {
    return handleDatabaseError(err, res);
  }

  switch (err.name) {
    case "ValidationError":
      return res.status(400).json({ message: err.message });
    case "UnauthorizedError":
      return res.status(401).json({ message: "Accès non autorisé" });
    case "JsonWebTokenError":
      return res.status(403).json({ message: "Token invalide" });
    case "TokenExpiredError":
      return res.status(403).json({ message: "Token expiré" });
    default:
      return res.status(500).json({
        message: "Internal Server Error",
        error: NODE_ENV === "development" ? err.message : undefined,
      });
  }
};

export const errorLogs = (req, res) => {
  if (NODE_ENV === "development") {
    fs.readFile("./logs/error.log", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Impossible de lire les logs" });
      }
      res.setHeader("Content-Type", "text/plain");
      return res.send(data);
    });
  } else {
    return res.status(403).json({ message: "Accès interdit" });
  }
};

export default errorMiddleware;