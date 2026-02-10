import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/app-card";
import { ProjectRequisitionForm } from "@/components/project-requisition-form";
import { useApps } from "@/hooks/use-apps";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { FileText, X, Sparkles, Zap, Rocket, ExternalLink, Bot, Cpu, Network, Workflow, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DeployedAppsShowcase } from "@/components/deployed-apps-showcase";
import { SmartSearch } from "@/components/smart-search";
import { IndustryInsights } from "@/components/industry-insights";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@assets/syc-hero-woman-and-robot_1751385387506.avif";
import projectBannerImage from "@assets/pwc_focus-photo_digital-banner_1600x900_30_0258_1751385870025.avif";
import genaiImage from "@assets/genai-story_1751387441561.webp";
import genaiDotsImage from "@assets/gen-ai-press-page-properties2_1751387545302.png";
import genaiCircleImage from "@assets/generative-ai-page_1751387666221.webp";
import agentPromoImage from "@assets/agent-marketplace-promo.png";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    setShowPromo(true);
  }, []);

  const { data: apps, isLoading } = useApps(
    search,
    category === "all" ? "" : category,
    subcategory === "all" ? "" : subcategory,
  );

  const { data: requisitions = [] } = useQuery<any[]>({
    queryKey: ["/api/requisitions"],
  });

  const totalApplications = (apps?.length || 0) + requisitions.length;

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setSubcategory("all");
  };

  const handleCategoryChange = (
    newCategory: string,
    newSubcategory?: string,
  ) => {
    setCategory(newCategory);
    if (newSubcategory) {
      setSubcategory(newSubcategory);
    } else {
      setSubcategory("all");
    }
  };

  const isFiltered = search || category !== "all" || subcategory !== "all";

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog open={showPromo} onOpenChange={setShowPromo}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-white/[0.08] rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] bg-[#0c0c14] [&>button]:hidden">
          <DialogTitle className="sr-only">Agent Marketplace Launch</DialogTitle>
          <DialogDescription className="sr-only">Promotional announcement for the new Agent Marketplace</DialogDescription>

          <div className="relative">
            <div className="relative h-44 overflow-hidden">
              <img
                src={agentPromoImage}
                alt="AI Agent Network"
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c14]/30 via-transparent to-[#0c0c14]" />
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setShowPromo(false)}
                  className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute top-3 left-3">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-300 tracking-widest uppercase">Live</span>
                </div>
              </div>
            </div>

            <div className="px-6 -mt-6 relative">
              <div className="flex items-end gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center border-2 border-[#0c0c14] shadow-lg shrink-0">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div className="pb-0.5">
                  <h2 className="text-xl font-extrabold text-white font-header leading-none tracking-tight">
                    Agent Marketplace
                  </h2>
                  <p className="text-[11px] text-white/40 mt-1">by ET Labs</p>
                </div>
              </div>

              <p className="text-[13px] text-white/50 leading-relaxed mb-5">
                Discover and deploy autonomous AI agents that execute enterprise workflows end-to-end — from data analysis to decision-making.
              </p>

              <div className="flex gap-1.5 mb-5">
                {[
                  { icon: Cpu, label: "Autonomous Agents", color: "text-cyan-400", bg: "bg-cyan-400/10" },
                  { icon: Network, label: "Orchestration", color: "text-indigo-400", bg: "bg-indigo-400/10" },
                  { icon: Workflow, label: "Automation", color: "text-purple-400", bg: "bg-purple-400/10" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className={`flex items-center gap-1.5 ${item.bg} rounded-lg px-2.5 py-1.5 flex-1`}>
                      <Icon className={`h-3.5 w-3.5 ${item.color} shrink-0`} />
                      <span className="text-[9px] font-semibold text-white/70 leading-tight">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Available Agents</span>
                  <span className="text-[10px] font-bold text-indigo-400">50+</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[
                      "bg-gradient-to-br from-cyan-400 to-cyan-600",
                      "bg-gradient-to-br from-indigo-400 to-indigo-600",
                      "bg-gradient-to-br from-purple-400 to-purple-600",
                      "bg-gradient-to-br from-pink-400 to-pink-600",
                      "bg-gradient-to-br from-amber-400 to-amber-600",
                    ].map((bg, i) => (
                      <div key={i} className={`w-6 h-6 ${bg} rounded-full border-2 border-[#0c0c14] flex items-center justify-center shadow-sm`}>
                        <Bot className="h-3 w-3 text-white/90" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/35">
                    Ready to deploy across your enterprise
                  </p>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-5 rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_28px_rgba(99,102,241,0.45)] transition-all duration-300 text-sm group"
                onClick={() => {
                  window.open('https://etlab-projects.pwc.in/agent-marketplace/', '_blank', 'noopener,noreferrer');
                  setShowPromo(false);
                }}
              >
                Explore Agent Store
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                onClick={() => setShowPromo(false)}
                className="w-full mt-2.5 mb-5 text-[11px] text-white/20 hover:text-white/45 transition-colors font-medium"
              >
                Skip for now
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Header
        onCategoryChange={handleCategoryChange}
        currentCategory={category}
        currentSubcategory={subcategory}
      />
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{ zIndex: 20 }}>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={genaiImage}
            alt="GenAI Innovation"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                <Sparkles className="h-3 w-3 text-orange-400" />
                <span className="text-[11px] font-medium text-white/90">AI-Powered</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[11px] font-medium text-white/80">{totalApplications} Apps</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-3 font-header leading-[1.1] tracking-tight">
              ET Labs — <span className="gradient-text">AI Driven</span> Rapid GTM
            </h1>
            <p className="text-sm sm:text-base text-white/60 mb-6 max-w-xl leading-relaxed font-body">
              Bridge between ideas and tangible working prototypes.
            </p>
            <SmartSearch />
          </div>
        </div>
      </div>
      <a
        href="https://etlab-projects.pwc.in/agent-marketplace/"
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden cursor-pointer border-y border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #0c0c18 40%, #0a1628 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={agentPromoImage}
            alt="Agent Marketplace"
            className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 mask-gradient-left"
            style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(99,102,241,0.08),transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Bot className="h-5.5 w-5.5 text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight font-header whitespace-nowrap">
                    Agent Marketplace
                  </h3>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-400/20 rounded-full">
                    <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                    <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">New</span>
                  </div>
                </div>
                <p className="text-xs text-white/35 mt-0.5 truncate">Discover, deploy & manage autonomous AI agents for enterprise workflows</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-2">
                {[
                  { icon: Cpu, color: "text-cyan-400" },
                  { icon: Network, color: "text-indigo-400" },
                  { icon: Workflow, color: "text-purple-400" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="w-7 h-7 bg-white/[0.04] border border-white/[0.06] rounded-lg flex items-center justify-center">
                      <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                    </div>
                  );
                })}
              </div>
              <div className="h-6 w-px bg-white/[0.06] hidden md:block" />
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl px-4 py-2 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 group-hover:border-indigo-400/30 transition-all duration-300">
                <span className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors whitespace-nowrap">
                  Explore
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </a>
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-header">Labs Editorial</h2>
              <p className="text-sm text-gray-500 mt-1">
                Access your enterprise tools and digital solutions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-600 border-0 rounded-full px-3 py-1">
                {apps?.length || 0} Available
              </Badge>
              {isFiltered && (
                <Button
                  onClick={handleClearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-gray-700 gap-1 h-7"
                >
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : apps && apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {apps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={() =>
                    window.open(app.url, "_blank", "noopener,noreferrer")
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm mx-auto shadow-sm">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-300 h-6 w-6" />
                </div>
                {isFiltered ? (
                  <>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-sm text-gray-500 mb-5">
                      No applications match your current filters
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm"
                      size="sm"
                    >
                      Clear All Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">No Applications</h3>
                    <p className="text-sm text-gray-500">
                      Applications will appear here once added through the Admin Panel
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <IndustryInsights />
      <DeployedAppsShowcase 
        searchValue={search}
        categoryFilter={category === "all" ? "" : category}
        subcategoryFilter={subcategory === "all" ? "" : subcategory}
      />
      <section id="project-requisition" className="bg-gray-50">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0">
            <img
              src={genaiCircleImage}
              alt="GenAI Innovation"
              className="w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/60" />
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 mb-4">
                <Sparkles className="h-3 w-3 text-orange-400" />
                <span className="text-xs font-medium text-white/90">Project Services</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 font-header tracking-tight">
                Ready to Start Your Project?
              </h2>
              <p className="text-sm sm:text-base text-white/60 mb-4 leading-relaxed">
                Submit your requirements and connect with our expert team.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Fast Response", "Expert Review", "Tailored Solutions"].map((label) => (
                  <span key={label} className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <ProjectRequisitionForm />
        </div>
      </section>
    </div>
  );
}
