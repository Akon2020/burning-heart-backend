import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Blog = db.define(
  "Blog",
  {
    idBlog: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    extrait: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Tags séparés par des virgules',
    },
    imageUne: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statut: {
      type: DataTypes.ENUM('brouillon', 'publie'),
      defaultValue: 'brouillon',
    },
    estimationLecture: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Temps de lecture estimé en minutes',
    },
    idAuteur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateurs',
        key: 'idUtilisateur',
      },
    },
    idCategorie: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'idCategorie',
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
    tableName: "blogs",
    timestamps: true,
    hooks: {
      beforeSave: (blog) => {
        if (blog.contenu) {
          const wordCount = blog.contenu.split(' ').length;
          blog.estimationLecture = Math.ceil(wordCount / 200);
        }
      }
    }
  }
);

export default Blog;