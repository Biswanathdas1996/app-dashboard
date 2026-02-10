import type { Express } from "express";
import express from "express";
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
  updateProjectRequisitionSchema,
  insertAnalyticsSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import Parser from "rss-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
  // Override the root redirect in production mode to serve directly
  if (process.env.NODE_ENV === "production") {
    // Get current directory for ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const distPath = path.resolve(__dirname, "public");
    
    // Check if dist directory exists
    try {
      await fs.access(distPath);
      // Serve static files from root instead of /app-dashboard
      app.use(express.static(distPath));
      
      // Handle root route to serve index.html directly
      app.get("/", async (req, res, next) => {
        try {
          const indexPath = path.resolve(distPath, "index.html");
          await fs.access(indexPath);
          res.sendFile(indexPath);
        } catch (error) {
          next();
        }
      });
    } catch (error) {
      // Dist path doesn't exist, skip static serving
    }
  }

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

  // Reorder web apps (MUST be before the parameterized routes)
  app.patch("/api/apps/reorder", async (req, res) => {
    try {
      const { reorderedIds } = req.body;
      
      if (!Array.isArray(reorderedIds) || reorderedIds.length === 0) {
        return res.status(400).json({ message: "Invalid reorder data" });
      }

      const success = await storage.reorderWebApps(reorderedIds);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to reorder apps" });
      }

      res.json({ message: "Apps reordered successfully" });
    } catch (error) {
      console.error("Error reordering apps:", error);
      res.status(500).json({ message: "Failed to reorder apps" });
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

  // Analytics routes
  app.post("/api/analytics", async (req, res) => {
    try {
      const analytics = insertAnalyticsSchema.parse(req.body);
      const created = await storage.createAnalytics(analytics);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      } else {
        console.error("Error creating analytics:", error);
        res.status(500).json({ message: "Failed to create analytics" });
      }
    }
  });

  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error getting analytics summary:", error);
      res.status(500).json({ message: "Failed to get analytics summary" });
    }
  });

  // AI News RSS feed endpoint
  const rssParser = new Parser({
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
    },
  });

  interface NewsArticle {
    title: string;
    description: string;
    url: string;
    image: string | null;
    source: string;
    publishedAt: string;
  }

  let cachedNews: NewsArticle[] = [];
  let lastFetchTime = 0;
  const CACHE_DURATION = 2 * 60 * 1000;

  const RSS_FEEDS = [
    { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch" },
    { url: "https://feeds.feedburner.com/venturebeat/SZYF", source: "VentureBeat" },
    { url: "https://www.technologyreview.com/feed/", source: "MIT Tech Review" },
    { url: "https://www.artificialintelligence-news.com/feed/", source: "AI News" },
  ];

  async function fetchOGImage(url: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      });
      clearTimeout(timeout);
      const html = await resp.text();
      const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (ogMatch) return ogMatch[1];
      const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
      if (twitterMatch) return twitterMatch[1];
      return null;
    } catch {
      return null;
    }
  }

  async function fetchAINews(): Promise<NewsArticle[]> {
    const now = Date.now();
    if (cachedNews.length > 0 && now - lastFetchTime < CACHE_DURATION) {
      return cachedNews;
    }

    const allArticles: NewsArticle[] = [];

    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await rssParser.parseURL(feed.url);
        const items = (parsed.items || []).slice(0, 4);
        for (const item of items) {
          const imgMatch = (item['content:encoded'] || item.content || item.summary || "")
            .match(/<img[^>]+src=["']([^"']+)["']/);
          const mediaContent = (item as any)['media:content']?.['$']?.url 
            || (item as any)['media:thumbnail']?.['$']?.url
            || null;

          allArticles.push({
            title: item.title || "Untitled",
            description: (item.contentSnippet || item.summary || "")
              .replace(/<[^>]*>/g, "").substring(0, 200),
            url: item.link || "#",
            image: item.enclosure?.url || mediaContent || (imgMatch ? imgMatch[1] : null),
            source: feed.source,
            publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error(`Failed to fetch RSS from ${feed.source}:`, err);
      }
    });

    await Promise.all(feedPromises);

    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const top = allArticles.slice(0, 8);

    const ogPromises = top.map(async (article) => {
      if (!article.image && article.url && article.url !== "#") {
        article.image = await fetchOGImage(article.url);
      }
    });
    await Promise.all(ogPromises);

    cachedNews = top;
    lastFetchTime = now;
    return cachedNews;
  }

  app.post("/api/generate-ppt-content", async (req, res) => {
    try {
      const { appName, description, category, subcategory } = req.body;
      if (!appName || !description) {
        return res.status(400).json({ error: "App name and description are required" });
      }

      const apiKey = process.env.PWC_GENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "PWC_GENAI_API_KEY not configured" });
      }

      const url = process.env.PWC_GENAI_ENDPOINT_URL || "https://genai-sharedservice-americas.pwc.com/completions";

      const prompt = `You are a professional presentation designer. Create a modern, visually appealing PowerPoint presentation for the following application.

Application Name: ${appName}
Category: ${category || "Technology"}
Subcategory: ${subcategory || ""}
Description: ${description}

Generate exactly 6 slides in valid JSON format. Each slide should have:
- "title": short slide title
- "subtitle": a subtitle or tagline (optional)
- "bullets": array of 3-5 concise bullet points
- "notes": speaker notes (1-2 sentences)
- "imageKeyword": a single keyword describing a relevant visual concept (e.g. "analytics", "security", "cloud", "dashboard", "automation")
- "imagePrompt": a detailed 1-2 sentence description of a professional illustration that would complement this slide's content (e.g. "A modern analytics dashboard showing real-time data visualization with colorful charts and graphs on a dark background")

The slides should follow this structure:
1. Title slide - app name, tagline, category
2. Problem Statement - what problem does it solve
3. Key Features - main capabilities
4. How It Works - workflow or process
5. Benefits & Impact - value proposition
6. Get Started - next steps, call to action

Return ONLY a valid JSON array of slide objects, no markdown, no code fences, no extra text.`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "API-Key": apiKey,
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "vertex_ai.gemini-2.0-flash",
          prompt: prompt,
          temperature: 0.7,
          top_p: 1,
          presence_penalty: 0,
          seed: 25,
          stream: false,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`PwC GenAI API Error ${response.status}: ${errorText.substring(0, 500)}`);
        return res.status(502).json({ error: "Failed to generate content from AI service" });
      }

      const data = await response.json() as any;

      let textContent = "";
      if (typeof data === "object" && data !== null) {
        for (const key of ["completion", "text", "output", "result"]) {
          if (typeof data[key] === "string") {
            textContent = data[key];
            break;
          }
        }
        if (!textContent && Array.isArray(data.choices) && data.choices.length > 0) {
          const choice = data.choices[0];
          if (typeof choice.text === "string") {
            textContent = choice.text;
          } else if (choice.message && typeof choice.message.content === "string") {
            textContent = choice.message.content;
          }
        }
        if (!textContent) {
          textContent = JSON.stringify(data);
        }
      } else {
        textContent = String(data);
      }

      let slides;
      try {
        const cleaned = textContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        slides = JSON.parse(cleaned);
        if (!Array.isArray(slides) || slides.length === 0) {
          throw new Error("Response is not a valid slide array");
        }
        slides = slides.map((s: any) => ({
          title: String(s.title || ""),
          subtitle: s.subtitle ? String(s.subtitle) : undefined,
          bullets: Array.isArray(s.bullets) ? s.bullets.map(String) : [],
          notes: s.notes ? String(s.notes) : undefined,
          imageKeyword: s.imageKeyword ? String(s.imageKeyword) : undefined,
          imagePrompt: s.imagePrompt ? String(s.imagePrompt) : undefined,
        }));
      } catch (parseErr) {
        console.error("Failed to parse LLM response:", textContent.substring(0, 800));
        slides = [
          { title: appName, subtitle: category || "Application Overview", bullets: ["Innovative solution for modern enterprises"], notes: "" },
          { title: "Overview", bullets: [description.substring(0, 300)], notes: "" },
          { title: "Key Features", bullets: ["Advanced capabilities", "Seamless integration", "Enterprise-grade security", "Real-time analytics"], notes: "" },
          { title: "How It Works", bullets: ["Simple setup process", "Intuitive interface", "Real-time processing", "Automated workflows"], notes: "" },
          { title: "Benefits", bullets: ["Increased efficiency", "Cost reduction", "Better insights", "Scalable solution"], notes: "" },
          { title: "Get Started", subtitle: "Begin your journey today", bullets: ["Contact our team", "Request a demo", "Start free trial"], notes: "" }
        ];
      }

      res.json({ slides, aiGenerated: Array.isArray(slides) && slides.length > 0 });
    } catch (error) {
      console.error("Error generating PPT content:", error);
      res.status(500).json({ error: "Failed to generate presentation content" });
    }
  });

  app.post("/api/generate-slide-image", async (req, res) => {
    try {
      const { prompt, slideIndex } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Image prompt is required" });
      }

      const apiKey = process.env.PWC_GENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "PWC_GENAI_API_KEY not configured" });
      }

      const baseUrl = (process.env.PWC_GENAI_ENDPOINT_URL || "https://genai-sharedservice-americas.pwc.com/completions").replace("/completions", "");

      const imagePrompt = `Generate a professional, modern, clean illustration for a business presentation slide. The image should be: ${prompt}. Style: flat design, corporate, minimal, high quality, no text overlays, suitable for a PowerPoint slide background or accent image. Colors should complement orange (#E8611A) and dark gray (#191919) brand palette.`;

      let imageBase64 = "";

      try {
        const imgResponse = await fetch(`${baseUrl}/images/generations`, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "API-Key": apiKey,
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "vertex_ai/imagen-3.0-generate-002",
            prompt: imagePrompt,
            n: 1,
            size: "1024x576",
            response_format: "b64_json"
          })
        });

        if (imgResponse.ok) {
          const imgData = await imgResponse.json() as any;
          if (imgData?.data?.[0]?.b64_json) {
            imageBase64 = imgData.data[0].b64_json;
          } else if (imgData?.data?.[0]?.url) {
            const fetchedImg = await fetch(imgData.data[0].url);
            const buffer = await fetchedImg.arrayBuffer();
            imageBase64 = Buffer.from(buffer).toString("base64");
          }
        }
      } catch (imgErr) {
        console.log("Imagen model attempt failed, trying Gemini multimodal...");
      }

      if (!imageBase64) {
        try {
          const geminiResponse = await fetch(`${baseUrl}/completions`, {
            method: "POST",
            headers: {
              "accept": "application/json",
              "API-Key": apiKey,
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "vertex_ai.gemini-2.0-flash",
              prompt: `Generate an image: ${imagePrompt}`,
              temperature: 0.8,
              max_tokens: 4096,
              stream: false,
              response_modalities: ["IMAGE", "TEXT"],
              media_resolution: "low"
            })
          });

          if (geminiResponse.ok) {
            const gemData = await geminiResponse.json() as any;
            const extractBase64 = (obj: any): string => {
              if (!obj || typeof obj !== "object") return "";
              if (obj.inline_data?.data) return obj.inline_data.data;
              if (obj.b64_json) return obj.b64_json;
              if (obj.image?.data) return obj.image.data;
              if (obj.data && typeof obj.data === "string" && obj.data.length > 500) return obj.data;
              for (const val of Object.values(obj)) {
                const found = extractBase64(val);
                if (found) return found;
              }
              return "";
            };
            imageBase64 = extractBase64(gemData);
          }
        } catch (gemErr) {
          console.log("Gemini multimodal attempt failed, generating SVG fallback...");
        }
      }

      if (!imageBase64) {
        const keywords = prompt.toLowerCase();
        const iconPaths: Record<string, string> = {
          analytics: '<circle cx="50" cy="70" r="8" fill="#E8611A"/><rect x="30" y="40" width="12" height="40" rx="3" fill="#E8611A" opacity="0.7"/><rect x="47" y="25" width="12" height="55" rx="3" fill="#E8611A" opacity="0.85"/><rect x="64" y="50" width="12" height="30" rx="3" fill="#E8611A" opacity="0.6"/><rect x="81" y="15" width="12" height="65" rx="3" fill="#E8611A"/>',
          security: '<path d="M56 15L30 30V50C30 68 41 84 56 90C71 84 82 68 82 50V30L56 15Z" fill="none" stroke="#E8611A" stroke-width="3"/><path d="M48 52L54 58L68 44" fill="none" stroke="#E8611A" stroke-width="3" stroke-linecap="round"/>',
          cloud: '<ellipse cx="56" cy="50" rx="28" ry="18" fill="#E8611A" opacity="0.3"/><ellipse cx="42" cy="55" rx="20" ry="14" fill="#E8611A" opacity="0.5"/><ellipse cx="70" cy="55" rx="18" ry="12" fill="#E8611A" opacity="0.4"/><circle cx="56" cy="45" r="15" fill="#E8611A" opacity="0.6"/>',
          automation: '<circle cx="56" cy="50" r="25" fill="none" stroke="#E8611A" stroke-width="2.5"/><circle cx="56" cy="50" r="8" fill="#E8611A"/><path d="M56 25V35M56 65V75M31 50H41M71 50H81" stroke="#E8611A" stroke-width="2.5" stroke-linecap="round"/>',
          dashboard: '<rect x="22" y="20" width="30" height="25" rx="4" fill="#E8611A" opacity="0.8"/><rect x="58" y="20" width="30" height="25" rx="4" fill="#E8611A" opacity="0.5"/><rect x="22" y="52" width="30" height="25" rx="4" fill="#E8611A" opacity="0.4"/><rect x="58" y="52" width="30" height="25" rx="4" fill="#E8611A" opacity="0.65"/>',
          launch: '<polygon points="56,15 70,75 56,60 42,75" fill="#E8611A"/><ellipse cx="56" cy="82" rx="18" ry="5" fill="#E8611A" opacity="0.3"/>',
          default: '<circle cx="56" cy="50" r="30" fill="none" stroke="#E8611A" stroke-width="2"/><circle cx="56" cy="50" r="15" fill="#E8611A" opacity="0.6"/><circle cx="56" cy="50" r="5" fill="#E8611A"/>'
        };

        let selectedIcon = iconPaths.default;
        for (const [key, val] of Object.entries(iconPaths)) {
          if (keywords.includes(key)) {
            selectedIcon = val;
            break;
          }
        }

        const hue = (slideIndex || 0) * 30 + 15;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 112 63">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:hsl(${hue},8%,12%)"/>
              <stop offset="100%" style="stop-color:hsl(${hue + 20},12%,18%)"/>
            </linearGradient>
            <radialGradient id="glow" cx="70%" cy="40%" r="50%">
              <stop offset="0%" style="stop-color:#E8611A;stop-opacity:0.15"/>
              <stop offset="100%" style="stop-color:#E8611A;stop-opacity:0"/>
            </radialGradient>
          </defs>
          <rect width="112" height="63" fill="url(#bg)"/>
          <rect width="112" height="63" fill="url(#glow)"/>
          <g transform="translate(0,0)">${selectedIcon}</g>
        </svg>`;

        imageBase64 = Buffer.from(svg).toString("base64");
        return res.json({ imageBase64, format: "svg+xml" });
      }

      res.json({ imageBase64, format: "png" });
    } catch (error) {
      console.error("Error generating slide image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  app.get("/api/news", async (_req, res) => {
    try {
      const articles = await fetchAINews();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.json([]);
    }
  });

  // Add catch-all route for SPA in production mode
  if (process.env.NODE_ENV === "production") {
    app.get("*", async (req, res) => {
      try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const distPath = path.resolve(__dirname, "public");
        const indexPath = path.resolve(distPath, "index.html");
        
        await fs.access(indexPath);
        res.sendFile(indexPath);
      } catch (error) {
        res.status(404).send("Page not found");
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
