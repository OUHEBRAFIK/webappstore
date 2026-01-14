
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import * as cheerio from "cheerio";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.apps.list.path, async (req, res) => {
    try {
      const query = {
        search: req.query.search as string,
        category: req.query.category as string,
        sort: req.query.sort as string,
      };
      const apps = await storage.getApps(query);
      res.json(apps);
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
    const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password === correctPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  return httpServer;
}
