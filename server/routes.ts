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

      const prompt = `You are an elite sales strategist creating a persuasive sales deck to close a deal. This presentation must SELL the solution to a prospective client. Every slide should drive the prospect closer to saying YES.

Product: ${appName}
Category: ${category || "Technology"}
Subcategory: ${subcategory || ""}
Product Description: ${description}

THIS IS A SALES PRESENTATION. Follow these rules strictly:
- Frame everything from the buyer's perspective — focus on THEIR pain, THEIR gains, THEIR ROI
- Use persuasive, benefit-driven language that creates urgency ("You're losing X every month without this")
- Quantify the cost of inaction and the value of adopting this solution
- Each bullet must answer the prospect's unspoken question: "Why should I care?"
- Use power words: Transform, Unlock, Eliminate, Maximize, Slash, Capture, Accelerate, Guarantee
- Include specific metrics, percentages, and timeframes to build credibility
- Speaker notes should contain sales talking points, objection handlers, and closing cues

Generate exactly 6 slides in valid JSON format. Each slide must have:
- "title": punchy, benefit-focused title (2-5 words)
- "subtitle": compelling value hook that speaks to the buyer (max 10 words)
- "bullets": array of exactly 4 persuasive bullet points (each 15-25 words, benefit-driven)
- "notes": sales talking points with objection handling tips
- "imageKeyword": MUST be exactly one of: "analytics", "security", "cloud", "automation", "finance", "healthcare", "teamwork", "development", "innovation", "network", "government", "management", "technology", "ux", "growth"

SALES DECK STRUCTURE:
1. Title Slide — Product name with a bold value proposition that hooks the prospect (NO bullets, leave bullets as empty array)
2. The Problem — Paint the prospect's pain points vividly, quantify what inaction costs them today
3. Our Solution — Position capabilities as direct answers to their pain, emphasize competitive differentiation
4. How It Works — Simple 4-step buyer journey from onboarding to results, make adoption feel effortless
5. Proven Results — ROI metrics, cost savings, time-to-value, competitive advantages they gain
6. Let's Get Started — Compelling call-to-action with urgency, risk-free trial or pilot offer, clear next steps

EXAMPLE BULLET QUALITY:
BAD: "Has security features"
GOOD: "Eliminate compliance risk with enterprise-grade encryption that meets SOC 2, HIPAA, and GDPR requirements out of the box"
BAD: "Saves time for teams"
GOOD: "Reclaim 15+ hours per week per team member by automating repetitive workflows that currently drain your most expensive resources"

Return ONLY a valid JSON array of slide objects. No markdown, no code fences, no explanation.`;

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
          imageKeyword: s.imageKeyword ? String(s.imageKeyword).toLowerCase() : undefined,
        }));
      } catch (parseErr) {
        console.error("Failed to parse LLM response:", textContent.substring(0, 800));
        slides = [
          { title: appName, subtitle: category ? `Unlock ${category} Excellence` : "Your Competitive Edge Starts Here", bullets: [], notes: "", imageKeyword: "technology" },
          { title: "The Cost of Inaction", subtitle: "What You're Losing Every Day Without This", bullets: ["Legacy systems are silently draining 30% of your team's productive hours on manual workarounds and redundant processes", "Critical decisions are delayed by days because scattered data prevents real-time visibility into operations", "Compliance gaps expose your organization to regulatory penalties and reputational damage that could cost millions", "Every month without automation, your competitors widen the efficiency gap and capture market share you're leaving behind"], notes: "", imageKeyword: "management" },
          { title: "Your Solution", subtitle: "Purpose-Built to Solve Your Biggest Challenges", bullets: ["Eliminate manual bottlenecks with intelligent automation that handles end-to-end workflows without human intervention", "Unlock real-time insights from unified data sources so your leadership team can make confident decisions in minutes, not weeks", "Seamlessly integrate with your existing enterprise stack through 50+ pre-built connectors — zero disruption to current operations", "Enterprise-grade security with SOC 2 compliance baked in, so you never have to choose between speed and safety"], notes: "", imageKeyword: "innovation" },
          { title: "How You Get Started", subtitle: "From Sign-Up to Results in 4 Simple Steps", bullets: ["Step 1: Onboard — Our team configures the platform to your exact requirements in a guided 30-minute setup session", "Step 2: Connect — Plug into your existing tools and data sources through secure APIs with no engineering effort required", "Step 3: Automate — Activate pre-built workflow templates tailored to your industry and start seeing efficiency gains immediately", "Step 4: Scale — Expand across departments and regions as your needs grow, with dedicated support at every stage"], notes: "", imageKeyword: "development" },
          { title: "Proven Results", subtitle: "Real Outcomes Our Clients Achieve", bullets: ["Slash operational costs by up to 45% within the first 6 months through intelligent process automation and waste elimination", "Accelerate time-to-decision by 5x with unified dashboards that surface actionable insights from all your data sources", "Achieve full ROI within 90 days — our fastest clients see measurable returns in under 30 days from deployment", "Reduce compliance incidents to near-zero with automated audit trails, policy enforcement, and real-time monitoring"], notes: "", imageKeyword: "growth" },
          { title: "Let's Get Started", subtitle: "Your Risk-Free Path to Transformation", bullets: ["Schedule a 30-minute personalized demo where we'll show you exactly how this solves your specific challenges", "Receive a custom ROI analysis and implementation roadmap tailored to your organization's goals and timeline", "Launch a no-commitment pilot program within 2 weeks — see the value before making any long-term decisions", "Join 500+ enterprise clients who have already transformed their operations and gained a lasting competitive advantage"], notes: "", imageKeyword: "teamwork" }
        ];
      }

      res.json({ slides, aiGenerated: Array.isArray(slides) && slides.length > 0 });
    } catch (error) {
      console.error("Error generating PPT content:", error);
      res.status(500).json({ error: "Failed to generate presentation content" });
    }
  });

  const STOCK_IMAGE_CATEGORIES = [
    "analytics", "security", "cloud", "automation", "finance",
    "healthcare", "teamwork", "development", "innovation", "network",
    "government", "management", "technology", "ux", "growth"
  ];

  const KEYWORD_SYNONYMS: Record<string, string[]> = {
    analytics: ["data", "dashboard", "chart", "report", "metrics", "visualization", "insights", "statistics", "bi", "intelligence"],
    security: ["cyber", "protection", "privacy", "compliance", "risk", "threat", "firewall", "encryption", "auth", "access"],
    cloud: ["saas", "infrastructure", "hosting", "server", "aws", "azure", "storage", "deployment", "microservice", "container"],
    automation: ["ai", "machine", "robot", "rpa", "workflow", "process", "automate", "bot", "artificial", "intelligent"],
    finance: ["financial", "banking", "payment", "accounting", "budget", "revenue", "cost", "investment", "audit", "tax"],
    healthcare: ["health", "medical", "patient", "clinical", "pharma", "hospital", "wellness", "care", "diagnosis"],
    teamwork: ["team", "collaboration", "people", "communication", "meeting", "stakeholder", "partner", "engage"],
    development: ["code", "software", "developer", "programming", "api", "build", "engineering", "agile", "devops", "tool"],
    innovation: ["innovate", "transform", "digital", "disrupt", "future", "strategy", "vision", "creative", "idea", "new"],
    network: ["connect", "integration", "system", "platform", "architecture", "interface", "iot", "device", "wireless"],
    government: ["gov", "public", "policy", "regulation", "civic", "municipal", "federal", "state", "citizen", "smart city"],
    management: ["project", "plan", "resource", "portfolio", "timeline", "milestone", "governance", "operations", "enterprise"],
    technology: ["tech", "digital", "modern", "solution", "capability", "feature", "overview", "summary", "introduction", "title"],
    ux: ["user", "experience", "design", "interface", "ui", "usability", "customer", "journey", "frontend", "app"],
    growth: ["success", "performance", "kpi", "target", "goal", "achievement", "impact", "scale", "benefit", "value"]
  };

  function matchStockImage(keyword: string, slideTitle: string, slideIndex: number): string {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (STOCK_IMAGE_CATEGORIES.includes(normalizedKeyword)) {
      const variant = (slideIndex % 2) + 1;
      return `/images/stock/${normalizedKeyword}_${variant}.jpg`;
    }

    const searchText = `${normalizedKeyword} ${slideTitle}`.toLowerCase();
    for (const [category, synonyms] of Object.entries(KEYWORD_SYNONYMS)) {
      for (const synonym of synonyms) {
        if (searchText.includes(synonym)) {
          const variant = (slideIndex % 2) + 1;
          return `/images/stock/${category}_${variant}.jpg`;
        }
      }
    }

    const fallbackCategories = ["technology", "innovation", "growth"];
    const fallbackIdx = slideIndex % fallbackCategories.length;
    const variant = (slideIndex % 2) + 1;
    return `/images/stock/${fallbackCategories[fallbackIdx]}_${variant}.jpg`;
  }

  app.post("/api/generate-slide-image", async (req, res) => {
    try {
      const { prompt, slideIndex, slideTitle } = req.body;
      const keyword = prompt || "technology";
      const title = slideTitle || "";
      const imagePath = matchStockImage(keyword, title, slideIndex || 0);

      const absolutePath = path.join(process.cwd(), "client", "public", imagePath);
      try {
        await fs.access(absolutePath);
        const imageBuffer = await fs.readFile(absolutePath);
        const imageBase64 = imageBuffer.toString("base64");
        res.json({ imageBase64, format: "jpeg", imagePath });
      } catch {
        const fallbackPath = path.join(process.cwd(), "client", "public", "/images/stock/technology_1.jpg");
        const imageBuffer = await fs.readFile(fallbackPath);
        const imageBase64 = imageBuffer.toString("base64");
        res.json({ imageBase64, format: "jpeg", imagePath: "/images/stock/technology_1.jpg" });
      }
    } catch (error) {
      console.error("Error serving stock image:", error);
      res.status(500).json({ error: "Failed to load image" });
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
