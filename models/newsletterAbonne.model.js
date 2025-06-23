import { DataTypes } from "sequelize";
import db from "../database/db.js";

const NewsletterAbonne = db.define(
  "NewsletterAbonne",
  {
    idNewsletterAbonne: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idNewsletter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'newsletters',
        key: 'idNewsletter',
      },
    },
    idAbonne: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'abonnes',
        key: 'idAbonne',
      },
    },
    statut: {
      type: DataTypes.ENUM('envoye', 'echec', 'attente'),
      defaultValue: 'attente',
    },
    dateEnvoi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "newslettersabonnes",
    timestamps: false,
  }
);

export default NewsletterAbonne;