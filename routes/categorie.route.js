import { Router } from "express";
import {
  getAllCategories,
  getCategorieById,
  getCategorieBySlug,
  createCategorie,
  updateCategorie,
  deleteCategorie,
} from "../controllers/categorie.controller.js";

const categorieRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Catégories
 *   description: API pour gérer les catégories de blog
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Catégories]
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée avec succès
 */
categorieRouter.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie par ID
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *       404:
 *         description: Catégorie non trouvée
 */
categorieRouter.get("/:id", getCategorieById);

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Récupérer une catégorie par son slug
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *       404:
 *         description: Catégorie non trouvée
 */
categorieRouter.get("/slug/:slug", getCategorieBySlug);

/**
 * @swagger
 * /api/categories/add:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     tags: [Catégories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomCategorie
 *             properties:
 *               nomCategorie:
 *                 type: string
 *                 example: "Développement Web"
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *       400:
 *         description: Données invalides ou catégorie existante
 */
categorieRouter.post("/add", createCategorie);

/**
 * @swagger
 * /api/categories/update/{id}:
 *   patch:
 *     summary: Mettre à jour une catégorie existante
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomCategorie:
 *                 type: string
 *                 example: "Développement Web"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *       404:
 *         description: Catégorie non trouvée
 */
categorieRouter.patch("/update/:id", updateCategorie);

/**
 * @swagger
 * /api/categories/delete/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie à supprimer
 *     responses:
 *       200:
 *         description: Catégorie supprimée
 *       404:
 *         description: Catégorie non trouvée
 */
categorieRouter.delete("/delete/:id", deleteCategorie);

export default categorieRouter;
