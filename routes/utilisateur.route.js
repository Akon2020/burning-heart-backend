import { Router } from "express";
import {
  createUtilisateur,
  deleteUtilisateur,
  getAllUtilisateurs,
  getSingleUtilisateur,
  getUtilisateurByEmail,
  updateUtilisateurPassword,
  updateUtilisateur,
} from "../controllers/utilisateur.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";

const userRouter = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
userRouter.get("/", getAllUtilisateurs);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       400:
 *         description: Utilisateur non trouvé
 */
userRouter.get("/:id", getSingleUtilisateur);

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Récupère un utilisateur par email
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Adresse email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       400:
 *         description: Email invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
userRouter.get("/email/:email", getUtilisateurByEmail);

/**
 * @swagger
 * /api/users/add:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nomComplet
 *               - email
 *             properties:
 *               nomComplet:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, auteur]
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Utilisateur existant ou données invalides
 *       500:
 *         description: Erreur serveur
 */
userRouter.post(
  "/add",
  upload.single("avatar"),
  normalizeUploadPaths,
  createUtilisateur
);

/**
 * @swagger
 * /api/users/update/{id}:
 *   patch:
 *     summary: Met à jour un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nomComplet:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, auteur]
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
userRouter.patch(
  "/update/:id",
  upload.single("avatar"),
  normalizeUploadPaths,
  updateUtilisateur
);

/**
 * @swagger
 * /api/users/update/{id}/password:
 *   patch:
 *     summary: Met à jour le mot de passe d'un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
userRouter.patch(
  "/update/:id/password",
  updateUtilisateurPassword
);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
userRouter.delete("/delete/:id", deleteUtilisateur);

export default userRouter;
