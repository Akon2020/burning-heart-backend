import { Router } from "express";
import {
  getAllEquipes,
  getSingleEquipe,
  getEquipeByFonction,
  createEquipe,
  updateEquipe,
  deleteEquipe,
} from "../controllers/equipe.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";

const equipeRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Équipes
 *   description: API pour gérer les membres de l'équipe
 */

/**
 * @swagger
 * /api/equipes:
 *   get:
 *     summary: Récupérer tous les membres de l'équipe
 *     tags: [Équipes]
 *     responses:
 *       200:
 *         description: Liste des membres récupérée avec succès
 */
equipeRouter.get("/", getAllEquipes);

/**
 * @swagger
 * /api/equipes/{id}:
 *   get:
 *     summary: Récupérer un membre par ID
 *     tags: [Équipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du membre
 *     responses:
 *       200:
 *         description: Membre trouvé
 *       404:
 *         description: Membre non trouvé
 */
equipeRouter.get("/:id", getSingleEquipe);

/**
 * @swagger
 * /api/equipes/fonction/{fonction}:
 *   get:
 *     summary: Récupérer un membre par sa fonction
 *     tags: [Équipes]
 *     parameters:
 *       - in: path
 *         name: fonction
 *         required: true
 *         schema:
 *           type: string
 *         description: Fonction du membre
 *     responses:
 *       200:
 *         description: Membre trouvé
 *       404:
 *         description: Membre non trouvé
 */
equipeRouter.get("/fonction/:fonction", getEquipeByFonction);

/**
 * @swagger
 * /api/equipes/add:
 *   post:
 *     summary: Ajouter un nouveau membre
 *     tags: [Équipes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nomComplet
 *               - fonction
 *             properties:
 *               nomComplet:
 *                 type: string
 *               fonction:
 *                 type: string
 *               biographie:
 *                 type: string
 *               ordre:
 *                 type: integer
 *               actif:
 *                 type: boolean
 *               photoProfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Membre ajouté avec succès
 *       400:
 *         description: Données invalides ou membre existant
 */
equipeRouter.post("/add", upload.single("photoProfil"), normalizeUploadPaths, createEquipe);

/**
 * @swagger
 * /api/equipes/update/{id}:
 *   patch:
 *     summary: Mettre à jour un membre
 *     tags: [Équipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du membre à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nomComplet:
 *                 type: string
 *               fonction:
 *                 type: string
 *               biographie:
 *                 type: string
 *               ordre:
 *                 type: integer
 *               actif:
 *                 type: boolean
 *               photoProfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Membre mis à jour avec succès
 *       404:
 *         description: Membre non trouvé
 */
equipeRouter.patch("/update/:id", upload.single("photoProfil"), normalizeUploadPaths, updateEquipe);

/**
 * @swagger
 * /api/equipes/delete/{id}:
 *   delete:
 *     summary: Supprimer un membre
 *     tags: [Équipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du membre à supprimer
 *     responses:
 *       200:
 *         description: Membre supprimé
 *       404:
 *         description: Membre non trouvé
 */
equipeRouter.delete("/delete/:id", deleteEquipe);

export default equipeRouter;
