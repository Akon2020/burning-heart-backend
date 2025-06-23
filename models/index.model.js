import db from "../database/db.js";
import Utilisateur from "./utilisateur.model.js";
import Categorie from "./categorie.model.js";
import Blog from "./blog.model.js";
import Newsletter from "./newsletter.model.js";
import Evenement from "./evenement.model.js";
import Equipe from "./equipe.model.js";
import Abonne from "./abonne.model.js";
import Contact from "./contact.model.js";
import InscriptionEvenement from "./inscriptionEvenement.model.js";
import NewsletterAbonne from "./newsletterAbonne.model.js";
import Commentaire from "./commentaire.model.js";

// Blog associations
Blog.belongsTo(Utilisateur, { foreignKey: "idAuteur", as: "auteur" });
Utilisateur.hasMany(Blog, { foreignKey: "idAuteur", as: "blogs" });

Blog.belongsTo(Categorie, { foreignKey: "idCategorie", as: "categorie" });
Categorie.hasMany(Blog, { foreignKey: "idCategorie", as: "blogs" });

// Commentaire-Blog associations
Commentaire.belongsTo(Blog, { foreignKey: "idBlog", as: "blog" });
Blog.hasMany(Commentaire, { foreignKey: "idBlog", as: "commentaires" });

// Commentaire-Utilisateur associations (pour les utilisateurs connectés)
Commentaire.belongsTo(Utilisateur, { foreignKey: "idUtilisateur", as: "utilisateur" });
Utilisateur.hasMany(Commentaire, { foreignKey: "idUtilisateur", as: "commentaires" });

// Commentaire-Commentaire associations (pour les réponses)
Commentaire.belongsTo(Commentaire, { foreignKey: "idCommentaireParent", as: "commentaireParent" });
Commentaire.hasMany(Commentaire, { foreignKey: "idCommentaireParent", as: "reponses" });

// Modération des commentaires
Commentaire.belongsTo(Utilisateur, { foreignKey: "modereBy", as: "moderateur" });
Utilisateur.hasMany(Commentaire, { foreignKey: "modereBy", as: "commentairesModeres" });

// Newsletter associations
Newsletter.belongsTo(Utilisateur, { foreignKey: "writedBy", as: "redacteur" });
Utilisateur.hasMany(Newsletter, { foreignKey: "writedBy", as: "newsletters" });

// Événement associations
Evenement.belongsTo(Utilisateur, { foreignKey: "createdBy", as: "createur" });
Utilisateur.hasMany(Evenement, { foreignKey: "createdBy", as: "evenements" });

// Inscription événement associations
InscriptionEvenement.belongsTo(Evenement, {
  foreignKey: "idEvenement",
  as: "evenement",
});
Evenement.hasMany(InscriptionEvenement, {
  foreignKey: "idEvenement",
  as: "inscriptions",
});

InscriptionEvenement.belongsTo(Utilisateur, {
  foreignKey: "idUtilisateur",
  as: "utilisateur",
});
Utilisateur.hasMany(InscriptionEvenement, {
  foreignKey: "idUtilisateur",
  as: "inscriptions",
});

// Newsletter-Abonné associations (Many-to-Many)
Newsletter.belongsToMany(Abonne, {
  through: NewsletterAbonne,
  foreignKey: "idNewsletter",
  otherKey: "idAbonne",
  as: "abonnes",
});
Abonne.belongsToMany(Newsletter, {
  through: NewsletterAbonne,
  foreignKey: "idAbonne",
  otherKey: "idNewsletter",
  as: "newsletters",
});

// Associations directes pour les statistiques
NewsletterAbonne.belongsTo(Newsletter, {
  foreignKey: "idNewsletter",
  as: "newsletter",
});
Newsletter.hasMany(NewsletterAbonne, {
  foreignKey: "idNewsletter",
  as: "envois",
});

NewsletterAbonne.belongsTo(Abonne, { foreignKey: "idAbonne", as: "abonne" });
Abonne.hasMany(NewsletterAbonne, { foreignKey: "idAbonne", as: "receptions" });

// Synchronisation des modèles
const syncModels = async () => {
  try {
    await db.sync({ alter: false });
    console.log("Modèles synchronisés avec succès");
  } catch (error) {
    console.error("Erreur lors de la synchronisation des modèles:", error);
    throw error;
  }
};

export {
  Utilisateur,
  Categorie,
  Blog,
  Newsletter,
  Evenement,
  Equipe,
  Abonne,
  Contact,
  InscriptionEvenement,
  NewsletterAbonne,
  Commentaire,
  syncModels,
};
