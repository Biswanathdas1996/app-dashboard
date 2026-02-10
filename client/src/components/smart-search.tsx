import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, Sparkles, ExternalLink, X, Briefcase, Globe } from "lucide-react";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import type { WebApp } from "@shared/schema";

interface ProjectRequisition {
  id: number;
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  priority: string;
  category: string;
  expectedDelivery: string;
  attachments: string[];
  logo: string;
  status: string;
  deployedLink: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  url?: string;
  source: "editorial" | "portfolio";
  relevance: number;
  matchedKeywords: string[];
}

const KEYWORD_SYNONYMS: Record<string, string[]> = {
  finance: ["financial", "banking", "money", "payment", "accounting", "budget", "investment", "insurance", "risk"],
  technology: ["tech", "software", "digital", "ai", "machine learning", "automation", "cloud", "data"],
  health: ["healthcare", "medical", "hospital", "patient", "wellness", "clinical"],
  government: ["gov", "govtech", "public", "civic", "municipal", "federal", "regulation"],
  security: ["cybersecurity", "protection", "encryption", "firewall", "compliance"],
  analytics: ["data", "dashboard", "metrics", "reporting", "insights", "visualization", "chart"],
  employee: ["hr", "human resources", "training", "staff", "workforce", "people"],
  customer: ["client", "user", "consumer", "crm", "engagement"],
  building: ["construction", "real estate", "property", "smart building", "iot", "facility"],
  insurance: ["risk", "underwriting", "claims", "policy", "actuarial"],
  manage: ["management", "admin", "organize", "control", "operations"],
  fast: ["quick", "rapid", "speed", "performance", "efficient"],
  new: ["latest", "recent", "modern", "fresh", "innovative"],
  all: ["everything", "show all", "list", "browse"],
};

function extractKeywords(query: string): string[] {
  const normalized = query.toLowerCase().trim();
  const words = normalized.split(/\s+/).filter(w => w.length > 1);
  const expanded = new Set<string>(words);

  words.forEach(word => {
    Object.entries(KEYWORD_SYNONYMS).forEach(([key, synonyms]) => {
      if (word === key || synonyms.some(s => s.includes(word) || word.includes(s))) {
        expanded.add(key);
        synonyms.forEach(s => expanded.add(s));
      }
    });
  });

  return Array.from(expanded);
}

function scoreResult(
  name: string,
  description: string,
  category: string,
  keywords: string[],
  rawQuery: string
): { score: number; matched: string[] } {
  const nameLower = name.toLowerCase();
  const descLower = description.toLowerCase();
  const catLower = category.toLowerCase();
  const queryLower = rawQuery.toLowerCase().trim();
  let score = 0;
  const matched: string[] = [];

  if (nameLower.includes(queryLower) && queryLower.length > 2) {
    score += 50;
    matched.push(rawQuery);
  }

  if (catLower.includes(queryLower) && queryLower.length > 2) {
    score += 30;
  }

  keywords.forEach(keyword => {
    if (nameLower.includes(keyword)) {
      score += 20;
      if (!matched.includes(keyword)) matched.push(keyword);
    }
    if (catLower.includes(keyword)) {
      score += 15;
      if (!matched.includes(keyword)) matched.push(keyword);
    }
    if (descLower.includes(keyword)) {
      score += 5;
      if (!matched.includes(keyword)) matched.push(keyword);
    }
  });

  return { score, matched };
}

function getSmartSuggestion(query: string, resultCount: number): string {
  if (resultCount === 0) {
    return `No matches found for "${query}". Try different keywords.`;
  }
  const q = query.toLowerCase();
  if (q.includes("finance") || q.includes("bank") || q.includes("money")) {
    return `Found ${resultCount} financial solution${resultCount !== 1 ? 's' : ''} that can help with your needs`;
  }
  if (q.includes("data") || q.includes("analytic") || q.includes("report")) {
    return `Found ${resultCount} analytics & data tool${resultCount !== 1 ? 's' : ''} for your use case`;
  }
  if (q.includes("security") || q.includes("risk")) {
    return `Found ${resultCount} security & risk solution${resultCount !== 1 ? 's' : ''} available`;
  }
  if (q.includes("employee") || q.includes("train") || q.includes("hr")) {
    return `Found ${resultCount} HR & training solution${resultCount !== 1 ? 's' : ''} for your team`;
  }
  return `Found ${resultCount} relevant application${resultCount !== 1 ? 's' : ''} for "${query}"`;
}

export function SmartSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: apps = [] } = useQuery<WebApp[]>({
    queryKey: ["/api/apps"],
  });

  const { data: requisitions = [] } = useQuery<ProjectRequisition[]>({
    queryKey: ["/api/requisitions"],
  });

  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const keywords = extractKeywords(query);
    const allResults: SearchResult[] = [];

    apps.forEach(app => {
      const { score, matched } = scoreResult(
        app.name,
        app.shortDescription || app.description || "",
        app.category,
        keywords,
        query
      );
      if (score > 0) {
        allResults.push({
          id: `app-${app.id}`,
          name: app.name,
          description: app.shortDescription || app.description || "",
          category: app.category,
          url: app.url,
          source: "editorial",
          relevance: score,
          matchedKeywords: matched,
        });
      }
    });

    requisitions.forEach(req => {
      const { score, matched } = scoreResult(
        req.title,
        req.description,
        req.category,
        keywords,
        query
      );
      if (score > 0) {
        allResults.push({
          id: `req-${req.id}`,
          name: req.title,
          description: req.description,
          category: req.category,
          url: req.deployedLink || undefined,
          source: "portfolio",
          relevance: score,
          matchedKeywords: matched,
        });
      }
    });

    allResults.sort((a, b) => b.relevance - a.relevance);
    return allResults.slice(0, 8);
  }, [query, apps, requisitions]);

  useEffect(() => {
    setIsOpen(query.trim().length >= 2 && isFocused);
  }, [query, isFocused]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLaunch = useCallback((result: SearchResult) => {
    if (result.url && result.url.trim()) {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
    setIsOpen(false);
  }, []);

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className={`relative transition-all duration-300 ${isOpen ? "z-50" : ""}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Sparkles className="h-4 w-4 text-orange-400" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask AI to find apps... e.g. 'I need a finance tool' or 'show analytics apps'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="pl-11 pr-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl focus:bg-white/15 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all text-sm backdrop-blur-md font-medium"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in z-50">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                <p className="text-xs font-medium text-gray-600">
                  {getSmartSuggestion(query, results.length)}
                </p>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleLaunch(result)}
                    className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${result.url ? "cursor-pointer hover:bg-gray-50" : "cursor-default"} mb-1`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      result.source === "editorial" 
                        ? "bg-gradient-to-br from-orange-500 to-orange-600" 
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}>
                      {result.source === "editorial" ? (
                        <Globe className="h-4 w-4 text-white" />
                      ) : (
                        <Briefcase className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                          {result.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">
                        {stripHtml(result.description)}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          result.source === "editorial"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {result.source === "editorial" ? "Labs Editorial" : "Project Portfolio"}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {result.category}
                        </span>
                        {result.matchedKeywords.length > 0 && (
                          <span className="text-[10px] text-gray-400">
                            matched: {result.matchedKeywords.slice(0, 3).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                    {result.url && (
                      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/10">
                          <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Search className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No matching applications found</p>
                <p className="text-xs text-gray-400 mt-1">Try broader keywords like "finance", "analytics", or "security"</p>
              </div>
            )}

            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                Smart Search
              </span>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">Esc</kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
