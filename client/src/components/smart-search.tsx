import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, Sparkles, ExternalLink, X, Briefcase, Globe, ArrowUpRight } from "lucide-react";
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

  const editorialResults = results.filter(r => r.source === "editorial");
  const portfolioResults = results.filter(r => r.source === "portfolio");

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className={`relative transition-all duration-200 ${isOpen ? "z-50" : ""}`}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-white/50 group-focus-within:text-orange-400 transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search apps... try 'finance tool' or 'analytics'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="w-full pl-10 pr-8 h-10 bg-white/[0.07] border border-white/[0.12] text-white text-[13px] placeholder:text-white/30 rounded-xl focus:bg-white/[0.12] focus:border-white/25 focus:outline-none focus:ring-1 focus:ring-orange-400/30 transition-all backdrop-blur-sm"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/25 hover:text-white/50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-200/80 overflow-hidden animate-scale-in z-50">
            {results.length > 0 ? (
              <div className="max-h-[340px] overflow-y-auto">
                <div className="px-3 pt-2.5 pb-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {editorialResults.length > 0 && (
                  <div className="px-1.5 pb-1">
                    {editorialResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleLaunch(result)}
                        className={`group/item flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 ${result.url ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0">
                          <Globe className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-gray-900 truncate group-hover/item:text-orange-600 transition-colors">
                              {result.name}
                            </span>
                            <span className="text-[9px] font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded shrink-0">
                              Editorial
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">
                            {result.category} {result.matchedKeywords.length > 0 && `· ${result.matchedKeywords.slice(0, 2).join(", ")}`}
                          </p>
                        </div>
                        {result.url && (
                          <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover/item:text-orange-500 shrink-0 transition-colors" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {editorialResults.length > 0 && portfolioResults.length > 0 && (
                  <div className="mx-3 border-t border-gray-100" />
                )}

                {portfolioResults.length > 0 && (
                  <div className="px-1.5 py-1">
                    {portfolioResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleLaunch(result)}
                        className={`group/item flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 ${result.url ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                          <Briefcase className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-gray-900 truncate group-hover/item:text-blue-600 transition-colors">
                              {result.name}
                            </span>
                            <span className="text-[9px] font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                              Portfolio
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">
                            {result.category} {result.matchedKeywords.length > 0 && `· ${result.matchedKeywords.slice(0, 2).join(", ")}`}
                          </p>
                        </div>
                        {result.url && (
                          <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover/item:text-blue-500 shrink-0 transition-colors" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-5 text-center">
                <Search className="h-5 w-5 text-gray-200 mx-auto mb-1.5" />
                <p className="text-xs text-gray-400">No results for "{query}"</p>
              </div>
            )}

            <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-orange-400" />
                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Smart Search</span>
              </div>
              <kbd className="text-[9px] text-gray-400 bg-white border border-gray-200 rounded px-1 py-0.5 font-mono leading-none">esc</kbd>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
