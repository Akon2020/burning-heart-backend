import { Commentaire, Utilisateur, Blog } from "../models/index.model.js";



export const createCommentaire = async (req, res, next) => {
  try {
    const {
      idBlog,
      idCommentaireParent,
      contenu,
      nomComplet,
      email,
      siteWeb,
    } = req.body;

    const idUtilisateur = req.user?.idUtilisateur || null;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    if (!idBlog || !contenu || !nomComplet || !email) {
      return res.status(400).json({
        message: "idBlog, contenu, nomComplet et email sont requis.",
      });
    }

    const blog = await Blog.findByPk(idBlog);
    if (!blog) return res.status(404).json({ message: "Blog non trouvé." });

    if (idCommentaireParent) {
      const parent = await Commentaire.findByPk(idCommentaireParent);
      if (!parent) {
        return res
          .status(400)
          .json({ message: "Commentaire parent invalide ou inexistant." });
      }
    }

    const nouveauCommentaire = await Commentaire.create({
      idBlog,
      idUtilisateur,
      idCommentaireParent,
      nomComplet,
      email,
      siteWeb,
      contenu,
      ipAddress,
      userAgent,
      statut: "attente",
    });

    return res.status(201).json({
      message: "Commentaire soumis avec succès, en attente de modération.",
      commentaire: nouveauCommentaire,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};


export const getCommentairesParBlog = async (req, res, next) => {
  try {
    const { idBlog } = req.params;
    const { approuves = true } = req.query;

    const blog = await Blog.findByPk(idBlog);
    if (!blog) return res.status(404).json({ message: "Blog non trouvé." });

    const scope = approuves === "false" ? [] : ["approuves"];

    const commentaires = await Commentaire.scope(scope).findAll({
      where: { idBlog },
      include: [
        {
          model: Utilisateur,
          as: "utilisateur",
          attributes: ["nomComplet", "avatar"],
        },
        {
          model: Commentaire,
          as: "reponses",
          required: false,
        },
      ],
      order: [["dateCommentaire", "DESC"]],
    });

    return res.status(200).json({
      nombre: commentaires.length,
      commentaires,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};


export const updateCommentaire = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      contenu,
      statut,
      signaleCommeSpam,
      nombreSignalements,
    } = req.body;

    const commentaire = await Commentaire.findByPk(id);
    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    if (contenu) commentaire.contenu = contenu;
    if (statut) commentaire.statut = statut;
    if (signaleCommeSpam !== undefined)
      commentaire.signaleCommeSpam = signaleCommeSpam;
    if (nombreSignalements !== undefined)
      commentaire.nombreSignalements = nombreSignalements;

    commentaire.modereBy = req.user?.idUtilisateur || null;

    await commentaire.save();

    return res.status(200).json({
      message: "Commentaire mis à jour avec succès.",
      commentaire,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};


export const deleteCommentaire = async (req, res, next) => {
  try {
    const { id } = req.params;

    const commentaire = await Commentaire.findByPk(id);
    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    await commentaire.destroy();

    return res.status(200).json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};


export const getAllCommentaires = async (req, res, next) => {
  try {
    const { statut } = req.query;
    const whereClause = {};

    if (statut) whereClause.statut = statut;

    const commentaires = await Commentaire.findAll({
      where: whereClause,
      include: [
        { model: Utilisateur, as: "utilisateur", attributes: ["nomComplet", "email"] },
        { model: Blog, as: "blog", attributes: ["titre"] },
      ],
      order: [["dateCommentaire", "DESC"]],
    });

    return res.status(200).json({
      total: commentaires.length,
      commentaires,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
