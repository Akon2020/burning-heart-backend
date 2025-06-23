import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Abonne = db.define(
  "Abonne",
  {
    idAbonne: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomComplet: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    statut: {
      type: DataTypes.ENUM('actif', 'inactif', 'desabonne'),
      defaultValue: 'actif',
    },
    dateAbonnement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dateDesabonnement: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "abonnes",
    timestamps: false,
  }
);

export default Abonne;