import slugify from "slugify";
import {
  Blog,
  Utilisateur,
  Categorie,
  Commentaire,
} from "../models/index.model.js";
import { Op } from "sequelize";

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
        {
          model: Utilisateur,
          as: "auteur",
          attributes: { exclude: ["motDePasse"] },
        },
        { model: Categorie, as: "categorie" },
        { model: Commentaire, as: "commentaires", required: false },
      ],
      order: [["createdAt", "DESC"]],
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
        {
          model: Categorie,
          as: "categorie",
        },
      ],
    });

    const commentaires = await Commentaire.scope(["approuve"]).findAll({
      where: { idBlog: blog.idBlog },
      order: [["dateCommentaire", "DESC"]],
      include: [
        {
          model: Utilisateur,
          as: "utilisateur",
          attributes: ["nomComplet", "avatar"],
        },
      ],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }

    await blog.update({ nombreVues: blog.nombreVues + 1 });

    return res.status(200).json({ blog, commentaires });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({
      where: { slug },
      include: [
        {
          model: Utilisateur,
          as: "auteur",
          attributes: ["nomComplet", "email", "avatar"],
        },
        { model: Categorie, as: "categorie" },
        {
          model: Commentaire.scope("approuve"),
          as: "commentaires",
          required: false,
        }
      ],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const statutValide = ["publie", "brouillon"];
    const { titre, slug, contenu, extrait, tags, idCategorie, statut } =
      req.body;
    const imageUne = req.file
      ? req.file.path
      : "https://placehold.co/600x400?text=Image+Blog";

    const idAuteur = req.user?.idUtilisateur;
    if (!idAuteur || !titre || !slug || !contenu) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    const blogExistant = await Blog.findOne({
      where: {
        [Op.or]: [{ titre }, { slug }],
      },
    });

    if (blogExistant) {
      return res
        .status(400)
        .json({ message: "Ce blog existe déjà (titre ou slug)" });
    }

    const categorieExistante = await Categorie.findByPk(idCategorie);
    if (!categorieExistante) {
      return res.status(400).json({ message: "Catégorie invalide ou inexistante" });
    }

    if (statut && !statutValide.includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const generatedSlug = slugify(titre, { lower: true, strict: true });
    const finalSlug = slug || generatedSlug;

    const nouveauBlog = await Blog.create({
      titre,
      slug: finalSlug,
      contenu,
      extrait,
      imageUne,
      tags,
      statut: statut || "brouillon",
      idAuteur,
      idCategorie,
      nombreVues: 0,
    });

    const blogComplet = await Blog.findByPk(nouveauBlog.idBlog, {
      include: [
        {
          model: Utilisateur,
          as: "auteur",
          attributes: ["nomComplet", "email", "avatar"],
        },
        { model: Categorie, as: "categorie" },
        { model: Commentaire, as: "commentaires", required: false },
      ],
    });

    return res.status(201).json({
      message: `Blog "${titre}" créé avec succès.`,
      blog: blogComplet,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = [
      "titre",
      "slug",
      "contenu",
      "extrait",
      "tags",
      "imageUne",
      "statut",
      "idCategorie",
    ];
    const donneesAMettreAJour = {};

    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }

    await blog.update(donneesAMettreAJour);

    const blogMisAJour = await Blog.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: "auteur",
          attributes: ["nomComplet", "email", "avatar"],
        },
        { model: Categorie, as: "categorie" },
        { model: Commentaire, as: "commentaires", required: false },
      ],
    });

    return res.status(200).json({
      message: `Blog "${blog.titre}" mis à jour avec succès.`,
      blog: blogMisAJour,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }

    await blog.destroy();

    return res
      .status(200)
      .json({ message: `Blog "${blog.titre}" supprimé avec succès.` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getBlogsByAuteur = async (req, res, next) => {
  try {
    const { idAuteur } = req.params;
    const blogs = await Blog.findAll({
      where: { idAuteur },
      include: [
        {
          model: Utilisateur,
          as: "auteur",
          attributes: ["nomComplet", "email", "avatar"],
        },
        { model: Categorie, as: "categorie" },
        { model: Commentaire, as: "commentaires", required: false },
      ],
    });

    return res.status(200).json({
      nombre: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getBlogsByStatut = async (req, res, next) => {
  try {
    const { statut } = req.params;
    const blogs = await Blog.findAll({
      where: { statut },
      include: [
        {
          model: Utilisateur,
          as: "auteur",
          attributes: ["nomComplet", "email", "avatar"],
        },
        { model: Categorie, as: "categorie" },
        { model: Commentaire, as: "commentaires", required: false },
      ],
    });

    return res.status(200).json({
      nombre: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
