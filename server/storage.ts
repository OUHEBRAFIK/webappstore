import { db } from "./db";
import {
  apps,
  reviews,
  type App,
  type InsertApp,
  type Review,
  type InsertReview
} from "@shared/schema";
import { eq, sql, desc } from "drizzle-orm";
import { translateDescription } from "./translate";

export interface IStorage {
  getApps(query?: { search?: string; category?: string; sort?: string }): Promise<App[]>;
  getApp(id: number): Promise<(App & { reviews: Review[] }) | undefined>;
  createApp(app: InsertApp): Promise<App>;
  createReview(review: InsertReview): Promise<Review>;
  bulkCreateApps(appsList: InsertApp[]): Promise<App[]>;
}

export class DatabaseStorage implements IStorage {
  async getApps(query?: { search?: string; category?: string; sort?: string }): Promise<App[]> {
    let q = db.select().from(apps);
    const conditions = [];

    if (query?.category) {
      conditions.push(sql`lower(${apps.category}) = ${query.category.toLowerCase()}`);
    }

    if (query?.search) {
      conditions.push(sql`lower(${apps.name}) LIKE ${`%${query.search.toLowerCase()}%`}`);
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
}

export const storage = new DatabaseStorage();
