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
  rating: z.number().min(1).max(5).default(0),
});

export const insertProjectRequisitionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  requesterName: z.string().min(1, "Requester name is required").max(100, "Name must be less than 100 characters"),
  requesterEmail: z.string().email("Invalid email address"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.string().min(1, "Category is required"),
  expectedDelivery: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  logo: z.string().optional(),
  isPrivate: z.boolean().default(false),
});

export const updateWebAppSchema = insertWebAppSchema.partial();
export const updateCategorySchema = insertCategorySchema.partial();
export const updateSubcategorySchema = insertSubcategorySchema.partial();
export const updateProjectRequisitionSchema = insertProjectRequisitionSchema.partial().extend({
  status: z.enum(["pending", "approved", "rejected", "in-progress", "completed"]).optional(),
});

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type InsertWebApp = z.infer<typeof insertWebAppSchema>;
export type InsertProjectRequisition = z.infer<typeof insertProjectRequisitionSchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type UpdateSubcategory = z.infer<typeof updateSubcategorySchema>;
export type UpdateWebApp = z.infer<typeof updateWebAppSchema>;
export type UpdateProjectRequisition = z.infer<typeof updateProjectRequisitionSchema>;

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
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProjectRequisition = {
  id: number;
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  expectedDelivery?: string;
  attachments: string[];
  logo?: string;
  status: "pending" | "approved" | "rejected" | "in-progress" | "completed";
  isPrivate: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};