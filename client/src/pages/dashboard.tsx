import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/app-card";
import { ProjectRequisitionForm } from "@/components/project-requisition-form";
import { useApps } from "@/hooks/use-apps";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { FileText, X, Sparkles, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { DeployedAppsShowcase } from "@/components/deployed-apps-showcase";
import { SmartSearch } from "@/components/smart-search";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@assets/syc-hero-woman-and-robot_1751385387506.avif";
import projectBannerImage from "@assets/pwc_focus-photo_digital-banner_1600x900_30_0258_1751385870025.avif";
import genaiImage from "@assets/genai-story_1751387441561.webp";
import genaiDotsImage from "@assets/gen-ai-press-page-properties2_1751387545302.png";
import genaiCircleImage from "@assets/generative-ai-page_1751387666221.webp";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");

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
      <Header
        onSearchChange={setSearch}
        searchValue={search}
        onCategoryChange={handleCategoryChange}
        currentCategory={category}
        currentSubcategory={subcategory}
      />

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0">
          <img
            src={genaiImage}
            alt="GenAI Innovation"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-medium text-white/90">AI-Powered Solutions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 font-header leading-[1.1] tracking-tight">
              ET Labs — <span className="gradient-text">AI Driven</span>{" "}
              Rapid GTM
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/70 mb-8 max-w-2xl leading-relaxed font-body">
              Acting as a bridge between ideas and tangible working prototypes.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/80 font-medium">{totalApplications} Applications</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-sm text-white/80 font-medium">Fast & Compliant</span>
              </div>
            </div>
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

      <section className="bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-header mb-3">
              Industry Insights
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Stay informed with the latest trends, research, and thought leadership
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Container train operations after 20 years of deregulation", gradient: "from-orange-500 to-rose-500", icon: Globe },
              { title: "Unlocking growth opportunities in India's insurance sector", gradient: "from-blue-500 to-indigo-500", icon: Shield },
              { title: "Building a resilient and efficient rural banking system", gradient: "from-emerald-500 to-teal-500", icon: Zap },
              { title: "Making the case for global workforce migration", gradient: "from-purple-500 to-violet-500", icon: Sparkles },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className={`aspect-[16/10] bg-gradient-to-br ${card.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-12 w-12 text-white/30 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                      {card.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-3 text-xs font-medium text-gray-400 group-hover:text-primary transition-colors">
                      Read more
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
