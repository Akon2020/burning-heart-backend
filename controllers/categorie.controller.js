import slugify from "slugify";
import { Categorie } from "../models/index.model.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categorie.findAll({ order: [["nomCategorie", "ASC"]] });
    return res.status(200).json({ total: categories.length, categories });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getCategorieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    return res.status(200).json({ categorie });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getCategorieBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const categorie = await Categorie.findOne({ where: { slug } });

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    return res.status(200).json({ categorie });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createCategorie = async (req, res, next) => {
  try {
    const { nomCategorie } = req.body;

    if (!nomCategorie) {
      return res.status(400).json({ message: "Le nom de la catégorie est requis." });
    }

    const slug = slugify(nomCategorie, { lower: true, strict: true });

    const existing = await Categorie.findOne({
      where: { slug },
    });

    if (existing) {
      return res.status(400).json({
        message: "Une catégorie avec ce nom existe déjà.",
      });
    }

    const newCategorie = await Categorie.create({
      nomCategorie,
      slug,
    });

    return res.status(201).json({
      message: "Catégorie créée avec succès",
      data: newCategorie,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateCategorie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nomCategorie } = req.body;

    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    if (nomCategorie) {
    categorie.nomCategorie = nomCategorie;
    categorie.slug = slugify(nomCategorie, { lower: true, strict: true });
    }

    await categorie.save();

    return res.status(200).json({
      message: "Catégorie mise à jour avec succès",
      data: categorie,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};


export const deleteCategorie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await categorie.destroy();

    return res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
