import {
  Blog,
  Utilisateur,
  Categorie,
  Commentaire,
} from "../models/index.model.js";

export const getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, statut, categorie } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (statut) whereClause.statut = statut;
    if (categorie) whereClause.idCategorie = categorie;

    const blogs = await Blog.findAndCountAll({
      where: whereClause,
      include: [
        { model: Utilisateur },
        { model: Categorie },
        { model: Commentaire },
      ],
      order: [["dateCreation", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      nombre: blogs.count,
      page: parseInt(page),
      totalPages: Math.ceil(blogs.count / limit),
      blogs: blogs.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: "auteur",
          attributes: ["nomComplet", "email", "avatar"],
        },
        { model: Categorie, as: "categorie" },
        {
          model: Commentaire,
          as: "commentaires",
          where: { statut: "approuve" },
          required: false,
          order: [["dateCommentaire", "DESC"]],
        },
      ],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }

    // Incrémenter les vues
    await blog.update({ nombreVues: blog.nombreVues + 1 });

    return res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

// export const getBlogBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params;
//     const blog = await Blog.findOne({
//       where: { slug },
//       include: [
//         { model: Utilisateur, as: "auteur", attributes: ["nomComplet", "email", "avatar"]}
