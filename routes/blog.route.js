import { Router } from "express";
import {
  getAllBlogs,
  getSingleBlog,
  getBlogBySlug,
  getBlogsByAuteur,
  getBlogsByStatut,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";

const blogRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: API pour gérer les blogs
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Récupérer tous les blogs (avec pagination)
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page courante
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         required: false
 *         description: Statut du blog (publie, brouillon)
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des blogs récupérée avec succès
 */
blogRouter.get("/", getAllBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Récupérer un blog par ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du blog
 *     responses:
 *       200:
 *         description: Blog trouvé
 *       404:
 *         description: Blog non trouvé
 */
blogRouter.get("/:id", getSingleBlog);

/**
 * @swagger
 * /api/blogs/search/slug/{slug}:
 *   get:
 *     summary: Récupérer un blog par son slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug du blog
 *     responses:
 *       200:
 *         description: Blog trouvé
 *       404:
 *         description: Blog non trouvé
 */
blogRouter.get("/search/slug/:slug", getBlogBySlug);

/**
 * @swagger
 * /api/blogs/auteur/{idAuteur}:
 *   get:
 *     summary: Récupérer les blogs par auteur
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: idAuteur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'auteur
 *     responses:
 *       200:
 *         description: Blogs de l'auteur récupérés
 */
blogRouter.get("/auteur/:idAuteur", getBlogsByAuteur);

/**
 * @swagger
 * /api/blogs/statut/{statut}:
 *   get:
 *     summary: Récupérer les blogs par statut
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: statut
 *         required: true
 *         schema:
 *           type: string
 *         description: Statut du blog (publie, brouillon)
 *     responses:
 *       200:
 *         description: Blogs par statut récupérés
 */
blogRouter.get("/statut/:statut", getBlogsByStatut);

/**
 * @swagger
 * /api/blogs/add:
 *   post:
 *     summary: Créer un nouveau blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - slug
 *               - contenu
 *             properties:
 *               titre:
 *                 type: string
 *               slug:
 *                 type: string
 *               contenu:
 *                 type: string
 *               extrait:
 *                 type: string
 *               tags:
 *                 type: string
 *               statut:
 *                 type: string
 *               idCategorie:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog créé avec succès
 */
blogRouter.post("/add", upload.single("image"), normalizeUploadPaths, createBlog);

/**
 * @swagger
 * /api/blogs/update/{id}:
 *   patch:
 *     summary: Mettre à jour un blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du blog à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               slug:
 *                 type: string
 *               contenu:
 *                 type: string
 *               extrait:
 *                 type: string
 *               tags:
 *                 type: string
 *               statut:
 *                 type: string
 *               idCategorie:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog mis à jour avec succès
 *       404:
 *         description: Blog non trouvé
 */
blogRouter.patch("/update/:id", upload.single("image"), normalizeUploadPaths, updateBlog);

/**
 * @swagger
 * /api/blogs/delete/{id}:
 *   delete:
 *     summary: Supprimer un blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du blog à supprimer
 *     responses:
 *       200:
 *         description: Blog supprimé avec succès
 *       404:
 *         description: Blog non trouvé
 */
blogRouter.delete("/delete/:id", deleteBlog);

export default blogRouter;
