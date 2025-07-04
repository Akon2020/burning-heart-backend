import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import logger from "morgan";
import { PORT, HOST_URL } from "./config/env.js";
import db from "./database/db.js";
import { syncModels } from "./models/index.model.js";
import errorMiddleware, { errorLogs } from "./middlewares/error.middleware.js";
import { setupSwagger } from "./swagger.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/utilisateur.route.js";
import equipeRouter from "./routes/equipe.route.js";
import contactRouter from "./routes/contact.route.js";
import categorieRouter from "./routes/categorie.route.js";
import blogRouter from "./routes/blog.route.js";

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1024mb" }));
app.use(bodyParser.json({ limit: "1024mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:58248",
      "https://burningheartihs.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

setupSwagger(app);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: `Checking BurningHeart API\n=> Passed successfully at ${new Date()}`,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/equipes", equipeRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/categories", categorieRouter);
app.use("/api/blogs", blogRouter);

app.get("/error", errorLogs);
app.use(errorMiddleware);

app.listen(PORT, async (err) => {
  if (err) {
    console.log(`Une erreur s'est produite: ${err}`);
  } else {
    try {
      await syncModels();
      console.log(`Le serveur est lancé au http://localhost:${PORT}/`);
      console.log(`Documentation Swagger sur ${HOST_URL}/api-docs/`);
    } catch (error) {
      console.error("Erreur lors de la synchronisation des modèles:", error);
    }
  }
});

export default app;
