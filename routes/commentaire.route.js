import { Router } from "express";
import {
  getAllCommentaires,
  getCommentairesParBlog,
  createCommentaire,
  deleteCommentaire,
  modererCommentaire,
  getReponses,
} from "../controllers/commentaire.controller.js";

const commentaireRouter = Router();

commentaireRouter.get("/", getAllCommentaires);
commentaireRouter.get("/blog/:idBlog", getCommentairesParBlog);
commentaireRouter.get("/reponses/:id", getReponses);
commentaireRouter.post("/add", createCommentaire);
commentaireRouter.patch("/moderate/:id", modererCommentaire);
commentaireRouter.delete("/delete/:id", deleteCommentaire);

export default commentaireRouter;
