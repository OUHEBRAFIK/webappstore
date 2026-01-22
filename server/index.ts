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

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    // CE LOG VA NOUS DIRE EXACTEMENT CE QUI CLOCHE (Table manquante ? Problème de clé ?)
    console.error("ERREUR SUR LA ROUTE:", req.path);
    console.error("MESSAGE D'ERREUR:", err.message);
    console.error("STACK:", err.stack);

    const status = err.status || err.statusCode || 500;
    res.status(status).json({ 
      message: "Internal Server Error", 
      error: err.message  });
  });
})();

export default app;