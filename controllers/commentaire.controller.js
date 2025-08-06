import { Commentaire, Utilisateur, Blog } from "../models/index.model.js";
// import { Op } from "sequelize";

// Récupérer tous les commentaires (optionnellement filtrés)
export const getAllCommentaires = async (req, res, next) => {
  try {
    const commentaires = await Commentaire.findAll({
      include: [
        { model: Utilisateur, as: "utilisateur", attributes: ["nomComplet", "avatar"] },
        { model: Commentaire, as: "reponses" },
      ],
      order: [["dateCommentaire", "DESC"]],
    });

    return res.status(200).json({ total: commentaires.length, commentaires });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

// Récupérer les commentaires approuvés d'un blog (avec threads)
export const getCommentairesParBlog = async (req, res, next) => {
  try {
    const { idBlog } = req.params;

    const commentaires = await Commentaire.scope(["approuves", "racine"]).findAll({
      where: { idBlog },
      include: [
        {
          model: Commentaire,
          as: "reponses",
          include: [{ model: Utilisateur, as: "utilisateur", attributes: ["nomComplet", "avatar"] }],
        },
        { model: Utilisateur, as: "utilisateur", attributes: ["nomComplet", "avatar"] },
      ],
      order: [["dateCommentaire", "DESC"]],
    });

    return res.status(200).json({ total: commentaires.length, commentaires });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

// Créer un commentaire
export const createCommentaire = async (req, res, next) => {
  try {
    const {
      idBlog,
      idUtilisateur = null,
      idCommentaireParent = null,
      nomComplet,
      email,
      siteWeb,
      contenu,
      ipAddress,
      userAgent,
    } = req.body;

    if (!idBlog || !nomComplet || !email || !contenu) {
      return res.status(400).json({
        message: "Champs obligatoires manquants : idBlog, nomComplet, email, contenu",
      });
    }

    const nouveauCommentaire = await Commentaire.create({
      idBlog,
      idUtilisateur,
      idCommentaireParent,
      nomComplet,
      email,
      siteWeb,
      contenu,
      statut: "attente",
      ipAddress: ipAddress || req.ip,
      userAgent: userAgent || req.headers["user-agent"],
      // NE PAS inclure typeCommentaire ici
    });

    return res.status(201).json({
      message: "Commentaire envoyé et en attente de modération",
      data: nouveauCommentaire,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

// Modérer un commentaire
export const modererCommentaire = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut, modereBy } = req.body;

    const commentaire = await Commentaire.findByPk(id);
    if (!commentaire) return res.status(404).json({ message: "Commentaire non trouvé" });

    commentaire.statut = statut;
    commentaire.modereBy = modereBy;
    await commentaire.save();

    return res.status(200).json({ message: "Commentaire modéré avec succès", commentaire });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modération" });
    next(error);
  }
};

// Supprimer un commentaire
export const deleteCommentaire = async (req, res, next) => {
  try {
    const { id } = req.params;
    const commentaire = await Commentaire.findByPk(id);

    if (!commentaire) return res.status(404).json({ message: "Commentaire non trouvé" });

    await commentaire.destroy();

    return res.status(200).json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
    next(error);
  }
};

// Récupérer les réponses à un commentaire donné
export const getReponses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reponses = await Commentaire.findAll({
      where: { idCommentaireParent: id },
      include: [
        { model: Utilisateur, as: "utilisateur", attributes: ["nomComplet", "avatar"] },
      ],
      order: [["dateCommentaire", "ASC"]],
    });

    return res.status(200).json({ total: reponses.length, reponses });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
