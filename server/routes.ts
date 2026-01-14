
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import * as cheerio from "cheerio";

// Simple seeding function
async function seedDatabase() {
  const existing = await storage.getApps();
  if (existing.length > 0) return;

  const seedApps = [
    { name: "Canva", description: "Design for everyone. Create invitations, business cards, flyers, lesson plans, and more.", url: "https://www.canva.com", category: "Design", rating: 4.8, votes: 120 },
    { name: "Notion", description: "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.", url: "https://www.notion.so", category: "Productivity", rating: 4.9, votes: 200 },
    { name: "Figma", description: "The collaborative interface design tool. Build better products as a team.", url: "https://www.figma.com", category: "Design", rating: 4.9, votes: 180 },
    { name: "ChatGPT", description: "A conversational AI system that listens, learns, and challenges.", url: "https://chat.openai.com", category: "AI", rating: 4.9, votes: 500 },
    { name: "Discord", description: "Your place to talk. Whether you're part of a school club, gaming group, worldwide art community, or just a handful of friends.", url: "https://discord.com", category: "Social", rating: 4.7, votes: 300 },
    { name: "Excalidraw", description: "Virtual whiteboard for sketching hand-drawn like diagrams.", url: "https://excalidraw.com", category: "Productivity", rating: 4.8, votes: 150 },
    { name: "Photopea", description: "Advanced image editor supporting PSD, XCF, Sketch, XD and CDR formats.", url: "https://www.photopea.com", category: "Design", rating: 4.9, votes: 90 },
    { name: "Linear", description: "Linear is a better way to build products. Meet the new standard for modern software development.", url: "https://linear.app", category: "Development", rating: 4.8, votes: 80 },
    { name: "Replit", description: "Build software collaboratively from anywhere.", url: "https://replit.com", category: "Development", rating: 4.9, votes: 400 },
    { name: "Vercel", description: "Develop. Preview. Ship. Vercel is the platform for Frontend Developers.", url: "https://vercel.com", category: "Development", rating: 4.8, votes: 110 },
    { name: "Midjourney", description: "An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.", url: "https://midjourney.com", category: "AI", rating: 4.7, votes: 250 },
    { name: "GitHub", description: "GitHub is where over 100 million developers shape the future of software, together.", url: "https://github.com", category: "Development", rating: 4.9, votes: 600 },
    { name: "Slack", description: "Slack is a new way to communicate with your team. It's faster, better organized, and more secure than email.", url: "https://slack.com", category: "Productivity", rating: 4.6, votes: 220 },
    { name: "Trello", description: "Trello brings all your tasks, teammates, and tools together.", url: "https://trello.com", category: "Productivity", rating: 4.5, votes: 180 },
    { name: "Miro", description: "The visual collaboration platform for every team.", url: "https://miro.com", category: "Productivity", rating: 4.7, votes: 140 },
    { name: "CodePen", description: "CodePen is a social development environment for front-end designers and developers.", url: "https://codepen.io", category: "Development", rating: 4.8, votes: 130 },
    { name: "Dribbble", description: "Dribbble is the leading destination to find & showcase creative work and home to the world's best design professionals.", url: "https://dribbble.com", category: "Design", rating: 4.7, votes: 160 },
    { name: "Behance", description: "Search for creative work on the world's largest creative network.", url: "https://www.behance.net", category: "Design", rating: 4.6, votes: 140 },
    { name: "Reddit", description: "Reddit is a network of communities where people can dive into their interests, hobbies and passions.", url: "https://www.reddit.com", category: "Social", rating: 4.5, votes: 450 },
    { name: "Twitter / X", description: "From breaking news and entertainment to sports and politics, get the full story with all the live commentary.", url: "https://twitter.com", category: "Social", rating: 4.2, votes: 600 }
  ] as any[];

  console.log("Seeding database with initial apps...");
  await storage.bulkCreateApps(seedApps);
  console.log("Seeding complete!");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed on startup
  seedDatabase().catch(console.error);

  // List apps
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

  // Create app
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

  // Get single app
  app.get(api.apps.get.path, async (req, res) => {
    const app = await storage.getApp(Number(req.params.id));
    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }
    res.json(app);
  });

  // Rate app
  app.post(api.apps.rate.path, async (req, res) => {
    try {
      const { rating } = api.apps.rate.input.parse(req.body);
      const updatedApp = await storage.updateAppRating(Number(req.params.id), rating);
      res.json(updatedApp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rating" });
      }
      res.status(404).json({ message: "App not found" });
    }
  });

  // Scrape URL
  app.post(api.apps.scrape.path, async (req, res) => {
    try {
      const { url } = api.apps.scrape.input.parse(req.body);
      
      // Fetch the page
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $('meta[property="og:title"]').attr('content') || $('title').text() || "";
      const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
      const iconUrl = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');

      res.json({
        name: title.trim(),
        description: description.trim(),
        iconUrl: iconUrl ? new URL(iconUrl, url).toString() : undefined
      });
    } catch (e) {
      console.error("Scraping error:", e);
      res.status(400).json({ message: "Failed to scrape URL" });
    }
  });

  // Admin login
  app.post(api.admin.login.path, async (req, res) => {
    const { password } = req.body;
    // Simple environment variable check (or default to 'admin123')
    const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password === correctPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  return httpServer;
}
