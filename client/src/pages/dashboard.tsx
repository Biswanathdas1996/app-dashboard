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
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 rounded-3xl shadow-2xl [&>button]:hidden">
          <DialogTitle className="sr-only">Agent Marketplace Launch</DialogTitle>
          <DialogDescription className="sr-only">Promotional announcement for the new Agent Marketplace</DialogDescription>

          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={agentPromoImage}
              alt="AI Agent Network"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white/90 tracking-wider uppercase">Live Now</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-header leading-tight tracking-tight drop-shadow-lg">
                Agent <span className="bg-gradient-to-r from-cyan-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Marketplace</span>
              </h2>
              <p className="text-white/60 text-xs leading-relaxed">
                Autonomous AI agents for enterprise workflows
              </p>
            </div>
          </div>

          <div className="bg-[#0a0a0f] px-6 pb-6 pt-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: Cpu, label: "Autonomous", sub: "Agents", color: "from-cyan-500/15 to-cyan-500/5", border: "border-cyan-500/15", iconColor: "text-cyan-400" },
                { icon: Network, label: "Multi-Agent", sub: "Orchestration", color: "from-indigo-500/15 to-indigo-500/5", border: "border-indigo-500/15", iconColor: "text-indigo-400" },
                { icon: Workflow, label: "Workflow", sub: "Automation", color: "from-purple-500/15 to-purple-500/5", border: "border-purple-500/15", iconColor: "text-purple-400" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`bg-gradient-to-b ${item.color} rounded-xl p-3 border ${item.border} text-center hover:scale-[1.03] transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${item.iconColor} mx-auto mb-1.5`} />
                    <p className="text-[10px] font-bold text-white/80 leading-tight">{item.label}</p>
                    <p className="text-[9px] text-white/35 mt-0.5">{item.sub}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-5">
              <div className="flex -space-x-1.5">
                {["bg-cyan-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"].map((bg, i) => (
                  <div key={i} className={`w-5 h-5 ${bg} rounded-full border-2 border-[#0a0a0f] flex items-center justify-center`}>
                    <Bot className="h-2.5 w-2.5 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/40 leading-tight">
                <span className="text-white/75 font-semibold">50+ agents</span> ready to deploy across your enterprise
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-5 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:shadow-[0_0_36px_rgba(99,102,241,0.4)] transition-all duration-300 text-sm border border-white/10 group"
              onClick={() => {
                window.open('https://etlab-projects.pwc.in/agent-marketplace/', '_blank', 'noopener,noreferrer');
                setShowPromo(false);
              }}
            >
              Enter the Agent Store
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => setShowPromo(false)}
              className="w-full mt-3 text-[11px] text-white/25 hover:text-white/50 transition-colors font-medium"
            >
              Continue to Dashboard
            </button>
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
