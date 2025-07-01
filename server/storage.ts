import { type User, type Category, type Subcategory, type WebApp, type InsertUser, type InsertCategory, type InsertSubcategory, type InsertWebApp, type UpdateCategory, type UpdateSubcategory, type UpdateWebApp } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

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
  categories: Category[];
  subcategories: Subcategory[];
  webApps: WebApp[];
  nextUserId: number;
  nextCategoryId: number;
  nextSubcategoryId: number;
  nextAppId: number;
}



export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private subcategories: Map<number, Subcategory>;
  private webApps: Map<number, WebApp>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentSubcategoryId: number;
  private currentAppId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.subcategories = new Map();
    this.webApps = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentSubcategoryId = 1;
    this.currentAppId = 1;
    this.loadFromFile();
  }

  private async loadFromFile() {
    try {
      await ensureDataDirectory();
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const storageData: StorageData = JSON.parse(data);
      
      // Load users
      storageData.users?.forEach(user => this.users.set(user.id, user));
      this.currentUserId = storageData.nextUserId || 1;
      
      // Load categories
      storageData.categories?.forEach(category => this.categories.set(category.id, category));
      this.currentCategoryId = storageData.nextCategoryId || 1;
      
      // Load subcategories
      storageData.subcategories?.forEach(subcategory => this.subcategories.set(subcategory.id, subcategory));
      this.currentSubcategoryId = storageData.nextSubcategoryId || 1;
      
      // Load web apps
      storageData.webApps?.forEach(app => this.webApps.set(app.id, app));
      this.currentAppId = storageData.nextAppId || 1;
    } catch (error) {
      // File doesn't exist or is corrupted, start with default data
      console.log('No existing data file found, initializing with default categories');
      await this.initializeDefaultCategories();
    }
  }

  private async saveToFile() {
    try {
      await ensureDataDirectory();
      const storageData: StorageData = {
        users: Array.from(this.users.values()),
        categories: Array.from(this.categories.values()),
        subcategories: Array.from(this.subcategories.values()),
        webApps: Array.from(this.webApps.values()),
        nextUserId: this.currentUserId,
        nextCategoryId: this.currentCategoryId,
        nextSubcategoryId: this.currentSubcategoryId,
        nextAppId: this.currentAppId,
      };
      await fs.writeFile(DATA_FILE, JSON.stringify(storageData, null, 2));
    } catch (error) {
      console.error('Failed to save data to file:', error);
    }
  }

  private async initializeDefaultCategories() {
    // Initialize default categories and subcategories
    const defaultCategories = [
      { name: "Financial Services", isActive: true },
      { name: "Healthcare & Life Sciences", isActive: true },
      { name: "Telecommunications", isActive: true },
      { name: "Government & Public Services", isActive: true },
      { name: "Infrastructure & Real Estate", isActive: true }
    ];

    const defaultSubcategories = [
      // Financial Services
      { name: "Banking & Lending", categoryId: 1, isActive: true },
      { name: "Insurance", categoryId: 1, isActive: true },
      { name: "Capital Markets", categoryId: 1, isActive: true },
      { name: "Non-Banking Financial Companies (NBFCs) & FinTech", categoryId: 1, isActive: true },
      { name: "Payments & Financial Infrastructure", categoryId: 1, isActive: true },
      { name: "Regulatory, Risk & Compliance", categoryId: 1, isActive: true },
      
      // Healthcare & Life Sciences
      { name: "Pharmaceuticals & Therapeutics", categoryId: 2, isActive: true },
      { name: "Biotechnology & Genomics", categoryId: 2, isActive: true },
      { name: "Healthcare Providers & Systems", categoryId: 2, isActive: true },
      { name: "Medical Devices & Diagnostics", categoryId: 2, isActive: true }
    ];

    // Add categories
    for (const category of defaultCategories) {
      const id = this.currentCategoryId++;
      const newCategory: Category = { ...category, id };
      this.categories.set(id, newCategory);
    }

    // Add subcategories
    for (const subcategory of defaultSubcategories) {
      const id = this.currentSubcategoryId++;
      const newSubcategory: Subcategory = { ...subcategory, id };
      this.subcategories.set(id, newSubcategory);
    }

    await this.saveToFile();
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

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(category => category.isActive);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { 
      id, 
      name: category.name, 
      isActive: category.isActive ?? true 
    };
    this.categories.set(id, newCategory);
    await this.saveToFile();
    return newCategory;
  }

  async updateCategory(id: number, category: UpdateCategory): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory: Category = { ...existingCategory, ...category };
    this.categories.set(id, updatedCategory);
    await this.saveToFile();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const category = this.categories.get(id);
    if (!category) return false;
    
    // Soft delete by setting isActive to false
    category.isActive = false;
    this.categories.set(id, category);
    await this.saveToFile();
    return true;
  }

  // Subcategory methods
  async getAllSubcategories(): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values()).filter(subcategory => subcategory.isActive);
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values())
      .filter(subcategory => subcategory.categoryId === categoryId && subcategory.isActive);
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    return this.subcategories.get(id);
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const id = this.currentSubcategoryId++;
    const newSubcategory: Subcategory = { 
      id, 
      name: subcategory.name, 
      categoryId: subcategory.categoryId,
      isActive: subcategory.isActive ?? true 
    };
    this.subcategories.set(id, newSubcategory);
    await this.saveToFile();
    return newSubcategory;
  }

  async updateSubcategory(id: number, subcategory: UpdateSubcategory): Promise<Subcategory | undefined> {
    const existingSubcategory = this.subcategories.get(id);
    if (!existingSubcategory) return undefined;
    
    const updatedSubcategory: Subcategory = { ...existingSubcategory, ...subcategory };
    this.subcategories.set(id, updatedSubcategory);
    await this.saveToFile();
    return updatedSubcategory;
  }

  async deleteSubcategory(id: number): Promise<boolean> {
    const subcategory = this.subcategories.get(id);
    if (!subcategory) return false;
    
    // Soft delete by setting isActive to false
    subcategory.isActive = false;
    this.subcategories.set(id, subcategory);
    await this.saveToFile();
    return true;
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
      shortDescription: insertApp.shortDescription,
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
        (app.description && app.description.toLowerCase().includes(query.toLowerCase())) ||
        (app.shortDescription && app.shortDescription.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || app.category === category;
      const matchesSubcategory = !subcategory || app.subcategory === subcategory;
      
      return matchesQuery && matchesCategory && matchesSubcategory;
    });
  }
}

export const storage = new MemStorage();
