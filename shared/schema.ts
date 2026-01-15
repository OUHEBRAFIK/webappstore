
import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const CATEGORIES = [
  "IA",
  "Productivité",
  "Design",
  "Jeux",
  "Développement",
  "Réseaux Sociaux",
  "Outils",
  "Divers"
] as const;

export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  category: text("category", { enum: CATEGORIES }).notNull(),
  iconUrl: text("icon_url"),
  externalRating: real("external_rating").default(0),
  rating: real("rating").default(0),
  votes: integer("votes").default(0),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  appId: integer("app_id").notNull(),
  username: text("username").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appsRelations = relations(apps, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  app: one(apps, {
    fields: [reviews.appId],
    references: [apps.id],
  }),
}));

export const insertAppSchema = createInsertSchema(apps).omit({ 
  id: true, 
  rating: true, 
  votes: true, 
  createdAt: true,
  isApproved: true 
}).extend({
  category: z.enum(CATEGORIES)
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Le commentaire ne peut pas être vide"),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
});

export type App = typeof apps.$inferSelect;
export type InsertApp = z.infer<typeof insertAppSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Request types
export type CreateAppRequest = InsertApp;
export type UpdateAppRequest = Partial<InsertApp>;
export type CreateReviewRequest = InsertReview;

export type ScrapeRequest = { url: string };
export type ScrapeResponse = { name: string; description: string; iconUrl?: string };

export type AdminLoginRequest = { password: string };
export type AdminLoginResponse = { success: boolean };
