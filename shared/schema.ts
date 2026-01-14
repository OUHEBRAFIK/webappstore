
import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const CATEGORIES = [
  "AI",
  "Productivity",
  "Design",
  "Games",
  "Development",
  "Social",
  "Other"
] as const;

export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  category: text("category", { enum: CATEGORIES }).notNull(),
  iconUrl: text("icon_url"), // Can be manually set or derived
  rating: real("rating").default(0), // Average rating
  votes: integer("votes").default(0), // Total number of votes
  isApproved: boolean("is_approved").default(true), // Admin approval status
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAppSchema = createInsertSchema(apps).omit({ 
  id: true, 
  rating: true, 
  votes: true, 
  createdAt: true,
  isApproved: true 
}).extend({
  category: z.enum(CATEGORIES)
});

export type App = typeof apps.$inferSelect;
export type InsertApp = z.infer<typeof insertAppSchema>;

// Request types
export type CreateAppRequest = InsertApp;
export type UpdateAppRequest = Partial<InsertApp>;

export type ScrapeRequest = { url: string };
export type ScrapeResponse = { name: string; description: string; iconUrl?: string };

export type AdminLoginRequest = { password: string };
export type AdminLoginResponse = { success: boolean };

export type RateAppRequest = { rating: number };
