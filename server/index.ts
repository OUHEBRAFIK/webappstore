import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

// On attrape les erreurs au démarrage
(async () => {
  try {
    console.log("Démarrage de registerRoutes...");
    await registerRoutes(httpServer, app);
    console.log("Routes enregistrées avec succès !");
  } catch (error) {
    console.error("CRASH AU DÉMARRAGE DES ROUTES:", error);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("ERREUR API:", err);
    res.status(500).json({ message: "Internal Server Error" });
  });
})();

export default app;