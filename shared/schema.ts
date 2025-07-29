import { z } from "zod";
import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subcategories table
export const subcategories = pgTable('subcategories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Web applications table
export const webApps = pgTable('web_apps', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  shortDescription: text('short_description'),
  description: text('description'),
  url: text('url').notNull(),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  icon: text('icon').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  attachments: text('attachments').array().default([]),
  rating: integer('rating').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Project requisitions table
export const projectRequisitions = pgTable('project_requisitions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requesterName: text('requester_name').notNull(),
  requesterEmail: text('requester_email').notNull(),
  priority: text('priority').notNull(), // 'low' | 'medium' | 'high' | 'urgent'
  category: text('category').notNull(),
  expectedDelivery: text('expected_delivery'),
  attachments: text('attachments').array().default([]),
  logo: text('logo'),
  status: text('status').default('pending').notNull(), // 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'
  deployedLink: text('deployed_link'), // Link to deployed application
  isPrivate: boolean('is_private').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
}));

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertSubcategorySchema = createInsertSchema(subcategories).omit({ id: true, createdAt: true });
export const insertWebAppSchema = createInsertSchema(webApps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertProjectRequisitionSchema = createInsertSchema(projectRequisitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Enhanced validation schemas
export const enhancedInsertWebAppSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  isActive: z.boolean().default(true),
  attachments: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).default(0),
});

export const enhancedInsertCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  isActive: z.boolean().default(true),
});

export const enhancedInsertSubcategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.number().min(1, "Category ID is required"),
  isActive: z.boolean().default(true),
});

export const enhancedInsertProjectRequisitionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  requesterName: z.string().min(1, "Requester name is required").max(100, "Name must be less than 100 characters"),
  requesterEmail: z.string().email("Invalid email address"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.string().min(1, "Category is required"),
  expectedDelivery: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  logo: z.string().optional(),
  deployedLink: z.string().url("Must be a valid URL").optional(),
  isPrivate: z.boolean().default(false),
});

// Update schemas
export const updateWebAppSchema = enhancedInsertWebAppSchema.partial();
export const updateCategorySchema = enhancedInsertCategorySchema.partial();
export const updateSubcategorySchema = enhancedInsertSubcategorySchema.partial();
export const updateProjectRequisitionSchema = enhancedInsertProjectRequisitionSchema.partial().extend({
  status: z.enum(["pending", "approved", "rejected", "in-progress", "completed"]).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;

export type WebApp = typeof webApps.$inferSelect;
export type InsertWebApp = z.infer<typeof insertWebAppSchema>;

export type ProjectRequisition = typeof projectRequisitions.$inferSelect;
export type InsertProjectRequisition = z.infer<typeof insertProjectRequisitionSchema>;

export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type UpdateSubcategory = z.infer<typeof updateSubcategorySchema>;
export type UpdateWebApp = z.infer<typeof updateWebAppSchema>;
export type UpdateProjectRequisition = z.infer<typeof updateProjectRequisitionSchema>;