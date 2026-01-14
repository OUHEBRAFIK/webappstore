
import { db } from "./db";
import {
  apps,
  type App,
  type InsertApp,
  type UpdateAppRequest
} from "@shared/schema";
import { eq, sql, desc } from "drizzle-orm";

export interface IStorage {
  getApps(query?: { search?: string; category?: string; sort?: string }): Promise<App[]>;
  getApp(id: number): Promise<App | undefined>;
  createApp(app: InsertApp): Promise<App>;
  updateAppRating(id: number, rating: number): Promise<App>;
  // For admin/seeding
  bulkCreateApps(appsList: InsertApp[]): Promise<App[]>;
}

export class DatabaseStorage implements IStorage {
  async getApps(query?: { search?: string; category?: string; sort?: string }): Promise<App[]> {
    let q = db.select().from(apps);
    const conditions = [];

    if (query?.category) {
      conditions.push(eq(apps.category, query.category));
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
      // @ts-ignore - weird drizzle type issue with dynamic where
      return await q.where(sql.join(conditions, sql` AND `)).orderBy(orderBy);
    }

    return await q.orderBy(orderBy);
  }

  async getApp(id: number): Promise<App | undefined> {
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    return app;
  }

  async createApp(insertApp: InsertApp): Promise<App> {
    const [app] = await db.insert(apps).values(insertApp).returning();
    return app;
  }

  async updateAppRating(id: number, newRating: number): Promise<App> {
    const app = await this.getApp(id);
    if (!app) throw new Error("App not found");

    // Calculate new average
    const currentTotal = (app.rating || 0) * (app.votes || 0);
    const newVotes = (app.votes || 0) + 1;
    const newAverage = (currentTotal + newRating) / newVotes;

    const [updated] = await db
      .update(apps)
      .set({ rating: newAverage, votes: newVotes })
      .where(eq(apps.id, id))
      .returning();
      
    return updated;
  }

  async bulkCreateApps(appsList: InsertApp[]): Promise<App[]> {
    if (appsList.length === 0) return [];
    return await db.insert(apps).values(appsList).returning();
  }
}

export const storage = new DatabaseStorage();
