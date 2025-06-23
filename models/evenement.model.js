import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Evenement = db.define(
  "Evenement",
  {
    idEvenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateEvenement: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    heureDebut: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    heureFin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    lieu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nombrePlaces: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nombreInscrits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    imageEvenement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statut: {
      type: DataTypes.ENUM('brouillon', 'publie', 'annule', 'termine'),
      defaultValue: 'brouillon',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateurs',
        key: 'idUtilisateur',
      },
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
    tableName: "evenements",
    timestamps: true,
  }
);

export default Evenement;