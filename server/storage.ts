import { db } from './db';
import { 
  users, 
  categories, 
  subcategories, 
  webApps, 
  projectRequisitions,
  type User,
  type Category,
  type Subcategory,
  type WebApp,
  type ProjectRequisition,
  type InsertUser,
  type InsertCategory,
  type InsertSubcategory,
  type InsertWebApp,
  type InsertProjectRequisition,
  type UpdateCategory,
  type UpdateSubcategory,
  type UpdateWebApp,
  type UpdateProjectRequisition,
} from '@shared/schema';
import { eq, desc, and, or, ilike } from 'drizzle-orm';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: UpdateCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Subcategories methods
  getAllSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]>;
  getSubcategory(id: number): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: number, subcategory: UpdateSubcategory): Promise<Subcategory | undefined>;
  deleteSubcategory(id: number): Promise<boolean>;
  
  // Web Apps methods
  getAllWebApps(): Promise<WebApp[]>;
  getWebApp(id: number): Promise<WebApp | undefined>;
  createWebApp(app: InsertWebApp): Promise<WebApp>;
  updateWebApp(id: number, app: UpdateWebApp): Promise<WebApp | undefined>;
  deleteWebApp(id: number): Promise<boolean>;
  searchWebApps(query: string, category?: string, subcategory?: string): Promise<WebApp[]>;
  
  // Project Requisitions methods
  getAllProjectRequisitions(): Promise<ProjectRequisition[]>;
  getProjectRequisition(id: number): Promise<ProjectRequisition | undefined>;
  createProjectRequisition(requisition: InsertProjectRequisition): Promise<ProjectRequisition>;
  updateProjectRequisition(id: number, requisition: UpdateProjectRequisition): Promise<ProjectRequisition | undefined>;
  deleteProjectRequisition(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: number, category: UpdateCategory): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const [updatedCategory] = await db
      .update(categories)
      .set({ isActive: false })
      .where(eq(categories.id, id))
      .returning();
    return !!updatedCategory;
  }

  // Subcategory methods
  async getAllSubcategories(): Promise<Subcategory[]> {
    return await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.isActive, true))
      .orderBy(subcategories.name);
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await db
      .select()
      .from(subcategories)
      .where(and(
        eq(subcategories.categoryId, categoryId),
        eq(subcategories.isActive, true)
      ))
      .orderBy(subcategories.name);
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, id));
    return subcategory || undefined;
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const [newSubcategory] = await db
      .insert(subcategories)
      .values(subcategory)
      .returning();
    return newSubcategory;
  }

  async updateSubcategory(id: number, subcategory: UpdateSubcategory): Promise<Subcategory | undefined> {
    const [updatedSubcategory] = await db
      .update(subcategories)
      .set(subcategory)
      .where(eq(subcategories.id, id))
      .returning();
    return updatedSubcategory || undefined;
  }

  async deleteSubcategory(id: number): Promise<boolean> {
    const [updatedSubcategory] = await db
      .update(subcategories)
      .set({ isActive: false })
      .where(eq(subcategories.id, id))
      .returning();
    return !!updatedSubcategory;
  }

  // Web App methods
  async getAllWebApps(): Promise<WebApp[]> {
    return await db
      .select()
      .from(webApps)
      .where(eq(webApps.isActive, true))
      .orderBy(desc(webApps.createdAt));
  }

  async getWebApp(id: number): Promise<WebApp | undefined> {
    const [app] = await db.select().from(webApps).where(eq(webApps.id, id));
    return app || undefined;
  }

  async createWebApp(insertApp: InsertWebApp): Promise<WebApp> {
    const [app] = await db
      .insert(webApps)
      .values({
        ...insertApp,
        icon: insertApp.icon || "fas fa-globe",
        attachments: insertApp.attachments || [],
        rating: insertApp.rating || 0,
      })
      .returning();
    return app;
  }

  async updateWebApp(id: number, updateApp: UpdateWebApp): Promise<WebApp | undefined> {
    const [updatedApp] = await db
      .update(webApps)
      .set({
        ...updateApp,
        updatedAt: new Date(),
      })
      .where(eq(webApps.id, id))
      .returning();
    return updatedApp || undefined;
  }

  async deleteWebApp(id: number): Promise<boolean> {
    const [deletedApp] = await db
      .delete(webApps)
      .where(eq(webApps.id, id))
      .returning();
    return !!deletedApp;
  }

  async searchWebApps(query: string, category?: string, subcategory?: string): Promise<WebApp[]> {
    const conditions = [eq(webApps.isActive, true)];

    if (query) {
      conditions.push(
        or(
          ilike(webApps.name, `%${query}%`),
          ilike(webApps.description, `%${query}%`),
          ilike(webApps.shortDescription, `%${query}%`)
        )!
      );
    }

    if (category) {
      conditions.push(eq(webApps.category, category));
    }

    if (subcategory) {
      conditions.push(eq(webApps.subcategory, subcategory));
    }

    return await db
      .select()
      .from(webApps)
      .where(and(...conditions))
      .orderBy(desc(webApps.createdAt));
  }

  // Project Requisition methods
  async getAllProjectRequisitions(): Promise<ProjectRequisition[]> {
    return await db
      .select()
      .from(projectRequisitions)
      .orderBy(desc(projectRequisitions.createdAt));
  }

  async getProjectRequisition(id: number): Promise<ProjectRequisition | undefined> {
    const [requisition] = await db.select().from(projectRequisitions).where(eq(projectRequisitions.id, id));
    return requisition || undefined;
  }

  async createProjectRequisition(insertRequisition: InsertProjectRequisition): Promise<ProjectRequisition> {
    const [requisition] = await db
      .insert(projectRequisitions)
      .values({
        ...insertRequisition,
        status: 'pending',
        attachments: insertRequisition.attachments || [],
      })
      .returning();
    return requisition;
  }

  async updateProjectRequisition(id: number, updateRequisition: UpdateProjectRequisition): Promise<ProjectRequisition | undefined> {
    const [updatedRequisition] = await db
      .update(projectRequisitions)
      .set({
        ...updateRequisition,
        updatedAt: new Date(),
      })
      .where(eq(projectRequisitions.id, id))
      .returning();
    return updatedRequisition || undefined;
  }

  async deleteProjectRequisition(id: number): Promise<boolean> {
    const [deletedRequisition] = await db
      .delete(projectRequisitions)
      .where(eq(projectRequisitions.id, id))
      .returning();
    return !!deletedRequisition;
  }
}

export const storage = new DatabaseStorage();