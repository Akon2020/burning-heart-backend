import { Router } from "express";
import {
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
} from "../controllers/auth.controller.js";
import {
  authenticationJWT,
  checkAuthStatus,
} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";

const authRouter = Router();

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Vérifie si l'utilisateur est connecté
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statut d'authentification renvoyé
 *       401:
 *         description: Non authentifié
 */
authRouter.get("/status", authenticationJWT, checkAuthStatus);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       401:
 *         description: Non authentifié
 */
authRouter.get("/profile", authenticationJWT, (req, res) => {
  res.json({ user: req.user });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Crée un nouveau compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomComplet
 *               - email
 *               - password
 *             properties:
 *               nomComplet:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données manquantes ou utilisateur déjà existant
 */
authRouter.post("/register", upload.single("avatar"), normalizeUploadPaths, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Email ou mot de passe incorrect
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       400:
 *         description: Email non trouvé ou invalide
 */
authRouter.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/resetpassword:
 *   post:
 *     summary: Met à jour le mot de passe avec le token de réinitialisation
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de réinitialisation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Données invalides ou token manquant
 */
authRouter.post("/resetpassword", updatePassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnecte l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
authRouter.post("/logout", logout);

export default authRouter;
