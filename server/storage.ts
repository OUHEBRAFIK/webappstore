import { db } from "./db.js";
import {
  apps,
  reviews,
  type App,
  type InsertApp,
  type Review,
  type InsertReview
} from "../shared/schema.js";
import { eq, sql, desc, type SQL } from "drizzle-orm";
import { translateDescription } from "./translate.js";
import type { PgColumn } from "drizzle-orm/pg-core";

// Function to normalize text for accent-insensitive search using PostgreSQL translate
// Character mapping (1:1 correspondence):
// àâä → aaa, éèêë → eeee, ïî → ii, ôö → oo, ùûü → uuu, ç → c, ñ → n
function normalizeText(column: PgColumn): SQL {
  const accentedFrom = "àâäáãéèêëíïîìóôöòõúùûüñçÀÂÄÁÃÉÈÊËÍÏÎÌÓÔÖÒÕÚÙÛÜÑÇ";
  const normalizedTo = "aaaaaeeeeiiiiooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC";
  return sql`lower(translate(COALESCE(${column}, ''), ${accentedFrom}, ${normalizedTo}))`;
}

// Function to normalize search term in JavaScript
function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export interface IStorage {
  getApps(query?: { search?: string; category?: string; sort?: string }): Promise<App[]>;
  getApp(id: number): Promise<(App & { reviews: Review[] }) | undefined>;
  createApp(app: InsertApp): Promise<App>;
  createReview(review: InsertReview): Promise<Review>;
  bulkCreateApps(appsList: InsertApp[]): Promise<App[]>;
  updateAppIconUrl(id: number, iconUrl: string): Promise<void>;
  getAllAppsForIconUpdate(): Promise<{ id: number; url: string; category: string }[]>;
  getTopAppsByCategory(limit?: number): Promise<{ category: string; apps: App[]; total: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getApps(query?: { search?: string; category?: string; sort?: string }): Promise<App[]> {
    let q = db.select().from(apps);
    const conditions = [];

    if (query?.category) {
      conditions.push(sql`lower(trim(${apps.category})) = ${query.category.toLowerCase().trim()}`);
    }

    if (query?.search) {
      const searchTerm = normalizeForSearch(query.search);
      conditions.push(sql`(
        ${normalizeText(apps.name)} LIKE ${`%${searchTerm}%`}
        OR ${normalizeText(apps.description)} LIKE ${`%${searchTerm}%`}
      )`);
    }

    let orderBy = desc(apps.createdAt);
    if (query?.sort === 'rating') {
      orderBy = desc(apps.rating);
    } else if (query?.sort === 'popular') {
      orderBy = desc(apps.votes);
    }

    if (conditions.length > 0) {
      return await q.where(sql.join(conditions, sql` AND `)).orderBy(orderBy);
    }

    return await q.orderBy(orderBy);
  }

  async getApp(id: number): Promise<(App & { reviews: Review[] }) | undefined> {
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    if (!app) return undefined;
    
    const appReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.appId, id))
      .orderBy(desc(reviews.createdAt));
      
    return { ...app, reviews: appReviews };
  }

  async createApp(insertApp: InsertApp): Promise<App> {
    // Automatically translate description for new apps
    const translatedDescription = await translateDescription(insertApp.description || "");
    const [app] = await db.insert(apps).values({
      ...insertApp,
      description: translatedDescription
    }).returning();
    return app;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    
    // Update app rating and votes
    const app = await this.getApp(insertReview.appId);
    if (app) {
      const currentTotal = (Number(app.rating) || 0) * (app.votes || 0);
      const newVotes = (app.votes || 0) + 1;
      const newAverage = (currentTotal + insertReview.rating) / newVotes;
      
      await db.update(apps)
        .set({ rating: newAverage, votes: newVotes })
        .where(eq(apps.id, insertReview.appId));
    }
    
    return review;
  }

  async bulkCreateApps(appsList: InsertApp[]): Promise<App[]> {
    if (appsList.length === 0) return [];
    return await db.insert(apps).values(appsList).returning();
  }

  async updateAppIconUrl(id: number, iconUrl: string): Promise<void> {
    await db.update(apps).set({ iconUrl }).where(eq(apps.id, id));
  }

  async getAllAppsForIconUpdate(): Promise<{ id: number; url: string; category: string }[]> {
    const result = await db.select({
      id: apps.id,
      url: apps.url,
      category: apps.category
    }).from(apps);
    return result.map(r => ({
      id: r.id,
      url: r.url || "",
      category: r.category || "Divers"
    }));
  }

  async getTopAppsByCategory(limit: number = 10): Promise<{ category: string; apps: App[]; total: number }[]> {
    const allApps = await db.select().from(apps).orderBy(desc(apps.rating), desc(apps.votes));
    
    const categoryMap = new Map<string, App[]>();
    
    for (const app of allApps) {
      const cat = app.category || "Divers";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(app);
    }
    
    const categoryOrder = ["IA", "Productivité", "Design", "Jeux", "Développement", "Outils", "Réseaux Sociaux"];
    const result: { category: string; apps: App[]; total: number }[] = [];
    
    for (const cat of categoryOrder) {
      const catApps = categoryMap.get(cat) || [];
      if (catApps.length > 0) {
        result.push({
          category: cat,
          apps: catApps.slice(0, limit),
          total: catApps.length
        });
      }
    }
    
    for (const [cat, catApps] of Object.entries(categoryMap)) {
            if (!categoryOrder.includes(cat) && catApps.length > 0) {
        result.push({
          category: cat,
          apps: catApps.slice(0, limit),
          total: catApps.length
        });
      }
    }
    
    return result;
  }
}

export const storage = new DatabaseStorage();
