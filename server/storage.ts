import { users, webApps, siteContent, navigationItems, type User, type InsertUser, type WebApp, type InsertWebApp, type UpdateWebApp, type SiteContent, type InsertSiteContent, type UpdateSiteContent, type NavigationItem, type InsertNavigationItem } from "@shared/schema";
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
  
  // Web Apps methods
  getAllWebApps(): Promise<WebApp[]>;
  getWebApp(id: number): Promise<WebApp | undefined>;
  createWebApp(app: InsertWebApp): Promise<WebApp>;
  updateWebApp(id: number, app: UpdateWebApp): Promise<WebApp | undefined>;
  deleteWebApp(id: number): Promise<boolean>;
  searchWebApps(query: string, category?: string, subcategory?: string): Promise<WebApp[]>;
  
  // Site Content methods
  getAllSiteContent(): Promise<SiteContent[]>;
  getSiteContentBySection(section: string): Promise<SiteContent | undefined>;
  createSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  updateSiteContent(id: number, content: UpdateSiteContent): Promise<SiteContent | undefined>;
  deleteSiteContent(id: number): Promise<boolean>;
  
  // Navigation methods
  getAllNavigationItems(): Promise<NavigationItem[]>;
  createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem>;
  updateNavigationItem(id: number, item: Partial<NavigationItem>): Promise<NavigationItem | undefined>;
  deleteNavigationItem(id: number): Promise<boolean>;
}

interface StorageData {
  users: User[];
  webApps: WebApp[];
  nextUserId: number;
  nextAppId: number;
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
      ...insertApp, 
      id,
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
        app.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || app.category === category;
      const matchesSubcategory = !subcategory || app.subcategory === subcategory;
      
      return matchesQuery && matchesCategory && matchesSubcategory;
    });
  }
  
  // Site Content methods
  async getAllSiteContent(): Promise<SiteContent[]> {
    // Return empty array for now - will be implemented with database
    return [];
  }

  async getSiteContentBySection(section: string): Promise<SiteContent | undefined> {
    // Return undefined for now - will be implemented with database
    return undefined;
  }

  async createSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    // Will be implemented with database
    throw new Error("Content management not implemented in memory storage");
  }

  async updateSiteContent(id: number, content: UpdateSiteContent): Promise<SiteContent | undefined> {
    // Will be implemented with database
    throw new Error("Content management not implemented in memory storage");
  }

  async deleteSiteContent(id: number): Promise<boolean> {
    // Will be implemented with database
    throw new Error("Content management not implemented in memory storage");
  }
  
  // Navigation methods
  async getAllNavigationItems(): Promise<NavigationItem[]> {
    // Return empty array for now - will be implemented with database
    return [];
  }

  async createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem> {
    // Will be implemented with database
    throw new Error("Navigation management not implemented in memory storage");
  }

  async updateNavigationItem(id: number, item: Partial<NavigationItem>): Promise<NavigationItem | undefined> {
    // Will be implemented with database
    throw new Error("Navigation management not implemented in memory storage");
  }

  async deleteNavigationItem(id: number): Promise<boolean> {
    // Will be implemented with database
    throw new Error("Navigation management not implemented in memory storage");
  }
}

export const storage = new MemStorage();
