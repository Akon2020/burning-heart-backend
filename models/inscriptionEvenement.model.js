import { DataTypes } from "sequelize";
import db from "../database/db.js";

const InscriptionEvenement = db.define(
  "InscriptionEvenement",
  {
    idInscription: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idEvenement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'evenements',
        key: 'idEvenement',
      },
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilisateurs',
        key: 'idUtilisateur',
      },
      comment: 'Référence vers un utilisateur connecté (optionnel)',
    },
    nomComplet: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nom complet de la personne inscrite (obligatoire pour tous)',
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      comment: 'Email de la personne inscrite (obligatoire pour tous)',
    },
    sexe: {
      type: DataTypes.ENUM('homme', 'femme'),
      allowNull: false,
      comment: 'Sexe de la personne inscrite',
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Numéro de téléphone de la personne inscrite',
    },
    statut: {
      type: DataTypes.ENUM('confirme', 'en_attente', 'annule'),
      defaultValue: 'confirme',
    },
    typeInscription: {
      type: DataTypes.ENUM('utilisateur', 'visiteur'),
      allowNull: false,
      comment: 'Indique si l\'inscription provient d\'un utilisateur connecté ou d\'un visiteur',
    },
    dateInscription: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "inscriptionsevenements",
    timestamps: false,
    hooks: {
      beforeCreate: (inscription) => {
        inscription.typeInscription = inscription.idUtilisateur ? 'utilisateur' : 'visiteur';
      },
      beforeUpdate: (inscription) => {
        inscription.typeInscription = inscription.idUtilisateur ? 'utilisateur' : 'visiteur';
      }
    },
    validate: {
      validateInscription() {
        if (!this.nomComplet || !this.email || !this.sexe || !this.telephone) {
          throw new Error('Le nom complet, l\'email, le sexe et le téléphone sont obligatoires pour toute inscription');
        }
      }
    }
  }
);

export default InscriptionEvenement;