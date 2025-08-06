import { Router } from "express";
import {
  getAllEvents,
  getSingleEvent,
  getEventsByDate,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/evenement.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";

const evenementRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Événements
 *   description: API pour gérer les événements
 */

/**
 * @swagger
 * /api/evenements:
 *   get:
 *     summary: Récupérer tous les événements publiés (pagination)
 *     tags: [Événements]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des événements récupérée avec succès
 */
evenementRouter.get("/", getAllEvents);

/**
 * @swagger
 * /api/evenements/admin:
 *   get:
 *     summary: Récupérer tous les événements (admin, tous statuts)
 *     tags: [Événements]
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrer par statut (publie, brouillon, annule, etc.)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Recherche par titre ou lieu
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Date de début
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Date de fin
 *     responses:
 *       200:
 *         description: Liste des événements (admin) récupérée
 */
evenementRouter.get("/admin", getAllEventsAdmin);

/**
 * @swagger
 * /api/evenements/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement
 *     responses:
 *       200:
 *         description: Événement trouvé
 *       404:
 *         description: Événement non trouvé
 */
evenementRouter.get("/:id", getSingleEvent);

/**
 * @swagger
 * /api/evenements/date/{date}:
 *   get:
 *     summary: Récupérer les événements à une date donnée
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de l'événement (format AAAA-MM-JJ)
 *     responses:
 *       200:
 *         description: Événements trouvés
 */
evenementRouter.get("/date/:date", getEventsByDate);

/**
 * @swagger
 * /api/evenements/add:
 *   post:
 *     summary: Créer un nouvel événement
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - description
 *               - dateEvenement
 *               - heureDebut
 *               - heureFin
 *               - lieu
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               dateEvenement:
 *                 type: string
 *                 format: date
 *               heureDebut:
 *                 type: string
 *               heureFin:
 *                 type: string
 *               lieu:
 *                 type: string
 *               nombrePlaces:
 *                 type: integer
 *               statut:
 *                 type: string
 *               imageEvenement:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Événement créé avec succès
 */
evenementRouter.post(
  "/add",
  authenticationJWT,
  upload.single("imageEvenement"),
  normalizeUploadPaths,
  createEvent
);

/**
 * @swagger
 * /api/evenements/update/{id}:
 *   patch:
 *     summary: Mettre à jour un événement
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               dateEvenement:
 *                 type: string
 *                 format: date
 *               heureDebut:
 *                 type: string
 *               heureFin:
 *                 type: string
 *               lieu:
 *                 type: string
 *               nombrePlaces:
 *                 type: integer
 *               statut:
 *                 type: string
 *               imageEvenement:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès
 *       404:
 *         description: Événement non trouvé
 */
evenementRouter.patch(
  "/update/:id",
  authenticationJWT,
  upload.single("imageEvenement"),
  normalizeUploadPaths,
  updateEvent
);

/**
 * @swagger
 * /api/evenements/delete/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement à supprimer
 *     responses:
 *       200:
 *         description: Événement supprimé/annulé avec succès
 *       404:
 *         description: Événement non trouvé
 */
evenementRouter.delete("/delete/:id", authenticationJWT, deleteEvent);

export default evenementRouter;
