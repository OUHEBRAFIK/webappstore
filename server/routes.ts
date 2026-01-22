
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";
import * as cheerio from "cheerio";
import { translateAllDescriptions } from "./translate";
import { db } from "./db.js";
import { apps } from "../shared/schema.js";
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Endpoint to trigger manual translation of all descriptions
  app.post("/api/admin/translate-all", async (req, res) => {
    try {
      // Basic check for admin password (should be improved in real scenarios)
      const { password } = req.body;
      const correctPassword = process.env.ADMIN_PASSWORD || "admin1234webappstore2026**";
      if (password !== correctPassword) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      // Run translation in background
      translateAllDescriptions().catch(err => console.error("Batch translation error:", err));
      
      res.json({ message: "Traduction lancée en arrière-plan" });
    } catch (e) {
      res.status(500).json({ message: "Erreur lors du lancement de la traduction" });
    }
  });

  // New endpoint for homepage with top 10 apps per category
  app.get("/api/apps/homepage", async (req, res) => {
    try {
      const categories = await storage.getTopAppsByCategory(10);
      res.json({ categories });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.apps.list.path, async (req, res) => {
    try {
      const query = {
        search: req.query.search as string,
        category: req.query.category as string,
        sort: req.query.sort as string,
      };
      
      const appsList = await storage.getApps(query);
      
      // Calculate category counts based on current filters (except the category filter itself)
      // Use dynamic categories from actual data
      const allApps = await storage.getApps({ search: query.search });
      const counts: Record<string, number> = {};
      const dynamicCategories = new Set<string>();
      
      allApps.forEach(app => {
        const cat = app.category || "Utilitaires";
        counts[cat] = (counts[cat] || 0) + 1;
        dynamicCategories.add(cat);
      });

      res.json({
        apps: appsList,
        counts,
        categories: Array.from(dynamicCategories).sort(),
        total: allApps.length
      });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.apps.get.path, async (req, res) => {
    const app = await storage.getApp(Number(req.params.id));
    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }
    res.json(app);
  });

  app.post(api.apps.create.path, async (req, res) => {
    try {
      const input = api.apps.create.input.parse(req.body);
      const app = await storage.createApp(input);
      res.status(201).json(app);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      const appId = Number(req.params.id);
      const input = api.reviews.create.input.parse(req.body);
      const review = await storage.createReview({ ...input, appId });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(404).json({ message: "App not found" });
    }
  });

  app.post(api.apps.scrape.path, async (req, res) => {
    try {
      const { url } = api.apps.scrape.input.parse(req.body);
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      const title = $('meta[property="og:title"]').attr('content') || $('title').text() || "";
      const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
      const iconUrl = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');

      res.json({
        name: title.trim(),
        description: description.trim(),
        iconUrl: iconUrl ? new URL(iconUrl, url).toString() : undefined
      });
    } catch (e) {
      res.status(400).json({ message: "Failed to scrape URL" });
    }
  });

  app.post(api.admin.login.path, async (req, res) => {
    const { password } = req.body;
    const correctPassword = process.env.ADMIN_PASSWORD || "admin1234webappstore2026**";
    if (password === correctPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  app.post("/api/admin/populate-icons", async (req, res) => {
    try {
      const { password } = req.body;
      const correctPassword = process.env.ADMIN_PASSWORD || "admin1234webappstore2026**";
      if (password !== correctPassword) {
        return res.status(401).json({ message: "Non autorise" });
      }

      const allApps = await storage.getAllAppsForIconUpdate();
      let updated = 0;
      let failed = 0;

      for (const app of allApps) {
        try {
          const url = new URL(app.url);
          const domain = url.hostname.replace(/^www\./, "");
          const clearbitUrl = `https://logo.clearbit.com/${domain}`;
          
          await storage.updateAppIconUrl(app.id, clearbitUrl);
          updated++;
        } catch (e) {
          failed++;
        }
      }

      res.json({ 
        message: `Mise a jour terminee: ${updated} apps avec logo, ${failed} echecs`,
        updated,
        failed 
      });
    } catch (e) {
      res.status(500).json({ message: "Erreur lors de la mise a jour des icones" });
    }
  });
// Route pour générer le sitemap.xml dynamiquement
app.get("/sitemap.xml", async (req, res) => {
  try {
    // 1. Récupérer toutes les applications depuis la base de données
    const allApps = await db.select().from(apps);

    // 2. Début du fichier XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Page d'accueil -->
      <url>
        <loc>https://webappstore.store/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>`;

    // 3. Ajouter chaque application dynamiquement
    allApps.forEach((app) => {
      sitemap += `
      <url>
        <loc>https://webappstore.store/app/${app.id}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    });

    sitemap += `\n</urlset>`;

    // 4. Envoyer le fichier avec le bon format
    res.header("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Erreur sitemap:", error);
    res.status(500).end();
  }
});
  return httpServer;
}
