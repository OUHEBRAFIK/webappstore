import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { createServer } from "http"; // Ajout de l'import pour le serveur

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Création d'un serveur temporaire pour satisfaire registerRoutes
const httpServer = createServer(app);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) {
        console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

(async () => {
  // ON PASSE LES DEUX ARGUMENTS ICI : httpServer et app
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
})();

export default app;