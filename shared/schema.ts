import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
});

export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  isActive: boolean("is_active").notNull().default(true),
});

export const webApps = pgTable("web_apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortDescription: text("short_description"),
  description: text("description").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  icon: text("icon").notNull().default("fas fa-globe"),
  isActive: boolean("is_active").notNull().default(true),
  attachments: text("attachments").array().default([]),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertSubcategorySchema = createInsertSchema(subcategories).omit({
  id: true,
});

export const insertWebAppSchema = createInsertSchema(webApps).omit({
  id: true,
});

export const updateWebAppSchema = insertWebAppSchema.partial();
export const updateCategorySchema = insertCategorySchema.partial();
export const updateSubcategorySchema = insertSubcategorySchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Subcategory = typeof subcategories.$inferSelect;
export type WebApp = typeof webApps.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type InsertWebApp = z.infer<typeof insertWebAppSchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type UpdateSubcategory = z.infer<typeof updateSubcategorySchema>;
export type UpdateWebApp = z.infer<typeof updateWebAppSchema>;
