import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const webApps = pgTable("web_apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  icon: text("icon").notNull().default("fas fa-globe"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWebAppSchema = createInsertSchema(webApps).omit({
  id: true,
});

export const updateWebAppSchema = insertWebAppSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WebApp = typeof webApps.$inferSelect;
export type InsertWebApp = z.infer<typeof insertWebAppSchema>;
export type UpdateWebApp = z.infer<typeof updateWebAppSchema>;
