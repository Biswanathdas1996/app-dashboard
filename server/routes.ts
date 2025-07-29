import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  enhancedInsertWebAppSchema, 
  updateWebAppSchema, 
  enhancedInsertCategorySchema, 
  updateCategorySchema, 
  enhancedInsertSubcategorySchema, 
  updateSubcategorySchema, 
  enhancedInsertProjectRequisitionSchema, 
  updateProjectRequisitionSchema 
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
async function ensureUploadsDirectory() {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
}

const storage_multer = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDirectory();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${sanitizedName}`);
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.doc', '.docx', '.pdf', '.txt', '.rtf'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only DOC, DOCX, PDF, TXT, RTF files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Kubernetes probes
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Get all web apps
  app.get("/api/apps", async (req, res) => {
    try {
      const { search, category, subcategory } = req.query;

      if (search || category || subcategory) {
        const apps = await storage.searchWebApps(
          (search as string) || "",
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
      const validatedApp = enhancedInsertWebAppSchema.parse(req.body);
      const app = await storage.createWebApp(validatedApp);
      res.status(201).json(app);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid app data", errors: error.errors });
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
        return res
          .status(400)
          .json({ message: "Invalid app data", errors: error.errors });
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

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedCategory = enhancedInsertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedCategory);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedCategory = updateCategorySchema.parse(req.body);
      const category = await storage.updateCategory(id, validatedCategory);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);

      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Subcategory routes
  app.get("/api/subcategories", async (req, res) => {
    try {
      const { categoryId } = req.query;
      
      if (categoryId) {
        const subcategories = await storage.getSubcategoriesByCategory(parseInt(categoryId as string));
        res.json(subcategories);
      } else {
        const subcategories = await storage.getAllSubcategories();
        res.json(subcategories);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  app.post("/api/subcategories", async (req, res) => {
    try {
      const validatedSubcategory = enhancedInsertSubcategorySchema.parse(req.body);
      const subcategory = await storage.createSubcategory(validatedSubcategory);
      res.status(201).json(subcategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid subcategory data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subcategory" });
    }
  });

  app.patch("/api/subcategories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedSubcategory = updateSubcategorySchema.parse(req.body);
      const subcategory = await storage.updateSubcategory(id, validatedSubcategory);

      if (!subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      res.json(subcategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid subcategory data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update subcategory" });
    }
  });

  app.delete("/api/subcategories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSubcategory(id);

      if (!deleted) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subcategory" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      res.json({
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  // File download endpoint
  app.get("/api/files/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);
      
      // Check if file exists
      await fs.access(filePath);
      
      // Get original filename for download
      const parts = filename.split('-');
      const originalName = parts.length > 1 ? parts.slice(1).join('-') : filename;
      
      res.download(filePath, originalName);
    } catch (error) {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Project Requisition routes
  app.get("/api/requisitions", async (req, res) => {
    try {
      const requisitions = await storage.getAllProjectRequisitions();
      res.json(requisitions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requisitions" });
    }
  });

  app.get("/api/requisitions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requisition = await storage.getProjectRequisition(id);
      
      if (!requisition) {
        return res.status(404).json({ message: "Requisition not found" });
      }
      
      res.json(requisition);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requisition" });
    }
  });

  app.post("/api/requisitions", async (req, res) => {
    try {
      const validatedRequisition = enhancedInsertProjectRequisitionSchema.parse(req.body);
      const requisition = await storage.createProjectRequisition(validatedRequisition);
      res.status(201).json(requisition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid requisition data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create requisition" });
    }
  });

  app.patch("/api/requisitions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedRequisition = updateProjectRequisitionSchema.parse(req.body);
      const requisition = await storage.updateProjectRequisition(id, validatedRequisition);

      if (!requisition) {
        return res.status(404).json({ message: "Requisition not found" });
      }

      res.json(requisition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid requisition data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update requisition" });
    }
  });

  app.delete("/api/requisitions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProjectRequisition(id);

      if (!deleted) {
        return res.status(404).json({ message: "Requisition not found" });
      }

      res.json({ message: "Requisition deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete requisition" });
    }
  });

  // Export all data endpoint (CSV format)
  app.get("/api/export", async (req, res) => {
    try {
      const apps = await storage.getAllWebApps();
      
      // Generate CSV content
      const csvHeader = [
        'ID',
        'Name',
        'Short Description',
        'Description',
        'URL',
        'Category',
        'Subcategory',
        'Icon',
        'Rating',
        'Is Active',
        'Attachments Count',
        'Created At',
        'Updated At'
      ].join(',');

      const csvRows = apps.map(app => {
        // Escape CSV values and handle commas/quotes
        const escapeCSV = (value: any): string => {
          if (value === null || value === undefined) return '';
          const str = String(value);
          // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
          if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        // Strip HTML tags from description for CSV
        const stripHtml = (html: string): string => {
          return html ? html.replace(/<[^>]*>/g, '').trim() : '';
        };

        return [
          app.id,
          escapeCSV(app.name),
          escapeCSV(app.shortDescription || ''),
          escapeCSV(stripHtml(app.description || '')),
          escapeCSV(app.url),
          escapeCSV(app.category),
          escapeCSV(app.subcategory || ''),
          escapeCSV(app.icon),
          app.rating || 0,
          app.isActive ? 'Yes' : 'No',
          app.attachments ? app.attachments.length : 0,
          escapeCSV(app.createdAt?.toISOString() || ''),
          escapeCSV(app.updatedAt?.toISOString() || '')
        ].join(',');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="apps-export.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Import data endpoint
  app.post("/api/import", async (req, res) => {
    try {
      const importData = req.body;
      
      // Validate import data structure
      if (!importData || !importData.apps || !importData.categories || !importData.subcategories) {
        return res.status(400).json({ message: "Invalid import data format" });
      }

      // Import categories first
      const categoryIdMapping = new Map();
      for (const category of importData.categories) {
        try {
          const newCategory = await storage.createCategory({
            name: category.name,
            isActive: category.isActive
          });
          categoryIdMapping.set(category.id, newCategory.id);
        } catch (error) {
          // Category might already exist, skip
        }
      }

      // Import subcategories with updated category IDs
      const subcategoryIdMapping = new Map();
      for (const subcategory of importData.subcategories) {
        try {
          const newCategoryId = categoryIdMapping.get(subcategory.categoryId) || subcategory.categoryId;
          const newSubcategory = await storage.createSubcategory({
            name: subcategory.name,
            categoryId: newCategoryId,
            isActive: subcategory.isActive
          });
          subcategoryIdMapping.set(subcategory.id, newSubcategory.id);
        } catch (error) {
          // Subcategory might already exist, skip
        }
      }

      // Import apps
      let importedAppsCount = 0;
      for (const app of importData.apps) {
        try {
          await storage.createWebApp({
            name: app.name,
            description: app.description,
            shortDescription: app.shortDescription,
            url: app.url,
            category: app.category,
            subcategory: app.subcategory,
            icon: app.icon,
            isActive: app.isActive,
            attachments: app.attachments || [],
            rating: app.rating || 1
          });
          importedAppsCount++;
        } catch (error) {
          // App might already exist, skip
        }
      }

      // Import project requisitions
      let importedRequisitionsCount = 0;
      if (importData.projectRequisitions) {
        for (const requisition of importData.projectRequisitions) {
          try {
            await storage.createProjectRequisition({
              title: requisition.title,
              description: requisition.description,
              requesterName: requisition.requesterName,
              requesterEmail: requisition.requesterEmail,
              priority: requisition.priority,
              category: requisition.category,
              expectedDelivery: requisition.expectedDelivery,
              attachments: requisition.attachments || [],
              isPrivate: requisition.isPrivate || false,
              logo: requisition.logo
            });
            importedRequisitionsCount++;
          } catch (error) {
            // Requisition might already exist, skip
          }
        }
      }

      res.json({ 
        message: "Import completed successfully",
        imported: {
          apps: importedAppsCount,
          categories: categoryIdMapping.size,
          subcategories: subcategoryIdMapping.size,
          requisitions: importedRequisitionsCount
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to import data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
