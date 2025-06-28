import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  getContactsByEmail,
  createContact,
  deleteContact,
  repondreContact,
} from "../controllers/contact.controller.js";

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API pour gérer les messages de contact
 */

const contactRouter = Router();

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Récupérer tous les messages de contact
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Liste des messages récupérée avec succès
 */
contactRouter.get("/", getAllContacts);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Récupérer un message de contact par ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du message
 *     responses:
 *       200:
 *         description: Message trouvé
 *       404:
 *         description: Message non trouvé
 */
contactRouter.get("/:id", getContactById);

/**
 * @swagger
 * /api/contacts/search/email/{email}:
 *   get:
 *     summary: Rechercher les messages par email
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Adresse email associée au message
 *     responses:
 *       200:
 *         description: Messages trouvés
 *       404:
 *         description: Aucun message trouvé avec cet email
 */
contactRouter.get("/search/email/:email", getContactsByEmail);

/**
 * @swagger
 * /api/contacts/add:
 *   post:
 *     summary: Envoyer un nouveau message de contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomComplet
 *               - email
 *               - message
 *             properties:
 *               nomComplet:
 *                 type: string
 *               email:
 *                 type: string
 *               sujet:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 */
contactRouter.post("/add", createContact);

/**
 * @swagger
 * /api/contacts/repondre/{id}:
 *   post:
 *     summary: Répondre à un message de contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du message de contact à répondre
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sujetReponse
 *               - messageReponse
 *             properties:
 *               sujetReponse:
 *                 type: string
 *                 example: Merci pour votre retour
 *               messageReponse:
 *                 type: string
 *                 example: Bonjour, nous avons bien reçu votre message et nous vous remercions pour votre intérêt.
 *     responses:
 *       200:
 *         description: Réponse envoyée avec succès
 *       400:
 *         description: Sujet ou message de réponse manquant
 *       404:
 *         description: Contact non trouvé
 *       500:
 *         description: Erreur serveur
 */
contactRouter.post("/repondre/:id", repondreContact);

/**
 * @swagger
 * /api/contacts/delete/{id}:
 *   delete:
 *     summary: Supprimer un message de contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du message à supprimer
 *     responses:
 *       200:
 *         description: Message supprimé avec succès
 *       404:
 *         description: Message non trouvé
 */
contactRouter.delete("/delete/:id", deleteContact)

export default contactRouter;
