import { z } from "zod";

// Basic schemas without database dependencies
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const insertSubcategorySchema = z.object({
  name: z.string().min(1),
  categoryId: z.number(),
  isActive: z.boolean().default(true),
});

export const insertWebAppSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  url: z.string().url(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  icon: z.string().min(1),
  isActive: z.boolean().default(true),
  attachments: z.array(z.string()).default([]),
});

export const updateWebAppSchema = insertWebAppSchema.partial();
export const updateCategorySchema = insertCategorySchema.partial();
export const updateSubcategorySchema = insertSubcategorySchema.partial();

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type InsertWebApp = z.infer<typeof insertWebAppSchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type UpdateSubcategory = z.infer<typeof updateSubcategorySchema>;
export type UpdateWebApp = z.infer<typeof updateWebAppSchema>;

export type User = {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
};

export type Category = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: Date;
};

export type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
  isActive: boolean;
  createdAt?: Date;
};

export type WebApp = {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  url: string;
  category: string;
  subcategory?: string;
  icon: string;
  isActive: boolean;
  attachments: string[];
  createdAt?: Date;
  updatedAt?: Date;
};