import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Equipe = db.define(
  "Equipe",
  {
    idEquipe: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomComplet: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fonction: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    biographie: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photoProfil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ordre: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Ordre d\'affichage dans l\'équipe',
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "equipes",
    timestamps: true,
  }
);

export default Equipe;