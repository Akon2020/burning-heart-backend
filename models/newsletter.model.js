import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Newsletter = db.define(
  "Newsletter",
  {
    idNewsletter: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titreInterne: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    objetMail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    statut: {
      type: DataTypes.ENUM('brouillon', 'envoye', 'programme'),
      defaultValue: 'brouillon',
    },
    dateProgrammee: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateEnvoi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    writedBy: {
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
    tableName: "newsletters",
    timestamps: true,
  }
);

export default Newsletter;