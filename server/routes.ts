import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWebAppSchema, updateWebAppSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all web apps
  app.get("/api/apps", async (req, res) => {
    try {
      const { search, category, subcategory } = req.query;
      
      if (search || category || subcategory) {
        const apps = await storage.searchWebApps(
          search as string || "",
          category as string,
          subcategory as string
        );
        res.json(apps);
      } else {
        const apps = await storage.getAllWebApps();
        res.json(apps);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  // Get single web app
  app.get("/api/apps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const app = await storage.getWebApp(id);
      
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json(app);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });

  // Create new web app
  app.post("/api/apps", async (req, res) => {
    try {
      const validatedApp = insertWebAppSchema.parse(req.body);
      const app = await storage.createWebApp(validatedApp);
      res.status(201).json(app);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid app data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create app" });
    }
  });

  // Update web app
  app.patch("/api/apps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedApp = updateWebAppSchema.parse(req.body);
      const app = await storage.updateWebApp(id, validatedApp);
      
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json(app);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid app data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update app" });
    }
  });

  // Delete web app
  app.delete("/api/apps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWebApp(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json({ message: "App deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete app" });
    }
  });

  // Get available categories and subcategories
  app.get("/api/categories", async (req, res) => {
    try {
      const apps = await storage.getAllWebApps();
      const categories = new Set(apps.map(app => app.category));
      const subcategories = new Set(apps.map(app => app.subcategory));
      
      res.json({
        categories: Array.from(categories).sort(),
        subcategories: Array.from(subcategories).sort()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
