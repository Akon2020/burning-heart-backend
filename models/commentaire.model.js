import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Commentaire = db.define(
  "Commentaire",
  {
    idCommentaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idBlog: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "blogs",
        key: "idBlog",
      },
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "utilisateurs",
        key: "idUtilisateur",
      },
      comment: "Référence vers un utilisateur connecté (optionnel)",
    },
    idCommentaireParent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "commentaires",
        key: "idCommentaire",
      },
      comment: "Pour les réponses aux commentaires (système de thread)",
    },
    nomComplet: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nom de la personne qui commente (obligatoire pour tous)",
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      comment: "Email de la personne qui commente (obligatoire pour tous)",
    },
    siteWeb: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
      comment: "Site web de la personne ou de l'entreprise (optionnel)",
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000],
      },
    },
    statut: {
      type: DataTypes.ENUM("attente", "approuve", "rejete", "spam"),
      defaultValue: "attente",
      comment: "Statut de modération du commentaire",
    },
    typeCommentaire: {
      type: DataTypes.ENUM("utilisateur", "visiteur"),
      allowNull: false,
      comment:
        "Indique si le commentaire provient d'un utilisateur connecté ou d'un visiteur",
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "Adresse IP pour la modération (IPv4/IPv6)",
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "User agent du navigateur pour la détection de spam",
    },
    signaleCommeSpam: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indique si le commentaire a été signalé comme spam",
    },
    nombreSignalements: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Nombre de fois que le commentaire a été signalé",
    },
    dateCommentaire: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dateModeration: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date de modération du commentaire",
    },
    modereBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "utilisateurs",
        key: "idUtilisateur",
      },
      comment: "Utilisateur qui a modéré le commentaire",
    },
  },
  {
    tableName: "commentaires",
    timestamps: false,
    indexes: [
      {
        fields: ["idBlog", "statut"],
      },
      {
        fields: ["email"],
      },
      {
        fields: ["statut"],
      },
      {
        fields: ["idCommentaireParent"],
      },
    ],
    hooks: {
      beforeCreate: (commentaire) => {
        commentaire.typeCommentaire = commentaire.idUtilisateur
          ? "utilisateur"
          : "visiteur";
      },
      beforeUpdate: (commentaire) => {
        commentaire.typeCommentaire = commentaire.idUtilisateur
          ? "utilisateur"
          : "visiteur";

        if (
          ["approuve", "rejete", "spam"].includes(commentaire.statut) &&
          !commentaire.dateModeration
        ) {
          commentaire.dateModeration = new Date();
        }
      },
    },
    validate: {
      validateCommentaire() {
        if (!this.nomComplet || !this.email || !this.contenu) {
          throw new Error(
            "Le nom complet, l'email et le contenu sont obligatoires"
          );
        }

        if (
          this.idCommentaireParent &&
          this.idCommentaireParent === this.idCommentaire
        ) {
          throw new Error("Un commentaire ne peut pas être parent de lui-même");
        }
      },
    },
    scopes: {
      approuves: {
        where: {
          statut: "approuve",
        },
      },
      enAttente: {
        where: {
          statut: "attente",
        },
      },
      parBlog: (idBlog) => ({
        where: {
          idBlog: idBlog,
        },
      }),
      racine: {
        where: {
          idCommentaireParent: null,
        },
      },
    },
  }
);

export default Commentaire;
