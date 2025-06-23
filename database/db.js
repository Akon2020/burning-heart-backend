import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASS, DB_USER, NODE_ENV } from "../config/env.js";

if (!DB_HOST) {
  throw new Error(
    "Veuillez definir le host de la base de donnée dans les variables d'environnement .env.<development/production>.local"
  );
}

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: NODE_ENV === "development" ? console.log : false,
});

(async () => {
  try {
    await db.authenticate();
    console.log(
      `Base de données ${DB_NAME} connectée avec succès en mode ${NODE_ENV}`
    );
  } catch (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
  }
})();

export default db;