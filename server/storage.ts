import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, ilike, or } from "drizzle-orm";
import { users, categories, subcategories, webApps, type User, type Category, type Subcategory, type WebApp, type InsertUser, type InsertCategory, type InsertSubcategory, type InsertWebApp, type UpdateCategory, type UpdateSubcategory, type UpdateWebApp } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const DATA_FILE = path.join(process.cwd(), 'data', 'apps.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

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
}

interface StorageData {
  users: User[];
  webApps: WebApp[];
  nextUserId: number;
  nextAppId: number;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: number, category: UpdateCategory): Promise<Category | undefined> {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Subcategory methods
  async getAllSubcategories(): Promise<Subcategory[]> {
    return await db.select().from(subcategories).where(eq(subcategories.isActive, true));
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await db.select().from(subcategories)
      .where(and(eq(subcategories.categoryId, categoryId), eq(subcategories.isActive, true)));
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    const result = await db.select().from(subcategories).where(eq(subcategories.id, id));
    return result[0];
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const result = await db.insert(subcategories).values(subcategory).returning();
    return result[0];
  }

  async updateSubcategory(id: number, subcategory: UpdateSubcategory): Promise<Subcategory | undefined> {
    const result = await db.update(subcategories).set(subcategory).where(eq(subcategories.id, id)).returning();
    return result[0];
  }

  async deleteSubcategory(id: number): Promise<boolean> {
    const result = await db.update(subcategories).set({ isActive: false }).where(eq(subcategories.id, id));
    return result.rowCount > 0;
  }

  // Web Apps methods
  async getAllWebApps(): Promise<WebApp[]> {
    return await db.select().from(webApps).where(eq(webApps.isActive, true));
  }

  async getWebApp(id: number): Promise<WebApp | undefined> {
    const result = await db.select().from(webApps).where(eq(webApps.id, id));
    return result[0];
  }

  async createWebApp(app: InsertWebApp): Promise<WebApp> {
    const result = await db.insert(webApps).values(app).returning();
    return result[0];
  }

  async updateWebApp(id: number, app: UpdateWebApp): Promise<WebApp | undefined> {
    const result = await db.update(webApps).set(app).where(eq(webApps.id, id)).returning();
    return result[0];
  }

  async deleteWebApp(id: number): Promise<boolean> {
    const result = await db.update(webApps).set({ isActive: false }).where(eq(webApps.id, id));
    return result.rowCount > 0;
  }

  async searchWebApps(query: string, category?: string, subcategory?: string): Promise<WebApp[]> {
    let dbQuery = db.select().from(webApps).$dynamic();
    
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
    
    return await dbQuery.where(and(...conditions));
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private webApps: Map<number, WebApp>;
  private currentUserId: number;
  private currentAppId: number;

  constructor() {
    this.users = new Map();
    this.webApps = new Map();
    this.currentUserId = 1;
    this.currentAppId = 1;
    this.loadFromFile();
  }

  private async loadFromFile() {
    try {
      await ensureDataDirectory();
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const storageData: StorageData = JSON.parse(data);
      
      // Load users
      storageData.users.forEach(user => this.users.set(user.id, user));
      this.currentUserId = storageData.nextUserId || 1;
      
      // Load web apps
      storageData.webApps.forEach(app => this.webApps.set(app.id, app));
      this.currentAppId = storageData.nextAppId || 1;
    } catch (error) {
      // File doesn't exist or is corrupted, start with empty data
      console.log('No existing data file found, starting with empty storage');
    }
  }

  private async saveToFile() {
    try {
      await ensureDataDirectory();
      const storageData: StorageData = {
        users: Array.from(this.users.values()),
        webApps: Array.from(this.webApps.values()),
        nextUserId: this.currentUserId,
        nextAppId: this.currentAppId,
      };
      await fs.writeFile(DATA_FILE, JSON.stringify(storageData, null, 2));
    } catch (error) {
      console.error('Failed to save data to file:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    await this.saveToFile();
    return user;
  }

  async getAllWebApps(): Promise<WebApp[]> {
    return Array.from(this.webApps.values()).filter(app => app.isActive);
  }

  async getWebApp(id: number): Promise<WebApp | undefined> {
    return this.webApps.get(id);
  }

  async createWebApp(insertApp: InsertWebApp): Promise<WebApp> {
    const id = this.currentAppId++;
    const app: WebApp = { 
      id,
      name: insertApp.name,
      shortDescription: insertApp.shortDescription ?? null,
      description: insertApp.description,
      url: insertApp.url,
      category: insertApp.category,
      subcategory: insertApp.subcategory,
      icon: insertApp.icon || "fas fa-globe",
      isActive: insertApp.isActive ?? true,
      attachments: insertApp.attachments || []
    };
    this.webApps.set(id, app);
    await this.saveToFile();
    return app;
  }

  async updateWebApp(id: number, updateApp: UpdateWebApp): Promise<WebApp | undefined> {
    const existingApp = this.webApps.get(id);
    if (!existingApp) return undefined;

    const updatedApp: WebApp = { ...existingApp, ...updateApp };
    this.webApps.set(id, updatedApp);
    await this.saveToFile();
    return updatedApp;
  }

  async deleteWebApp(id: number): Promise<boolean> {
    const deleted = this.webApps.delete(id);
    if (deleted) {
      await this.saveToFile();
    }
    return deleted;
  }

  async searchWebApps(query: string, category?: string, subcategory?: string): Promise<WebApp[]> {
    const apps = Array.from(this.webApps.values()).filter(app => app.isActive);
    
    return apps.filter(app => {
      const matchesQuery = !query || 
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.description.toLowerCase().includes(query.toLowerCase()) ||
        (app.shortDescription && app.shortDescription.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || app.category === category;
      const matchesSubcategory = !subcategory || app.subcategory === subcategory;
      
      return matchesQuery && matchesCategory && matchesSubcategory;
    });
  }
}

export const storage = new MemStorage();
