import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/app-card";
import { ProjectRequisitionForm } from "@/components/project-requisition-form";
import { useApps } from "@/hooks/use-apps";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-white">
      <Header
        onSearchChange={setSearch}
        searchValue={search}
        onCategoryChange={handleCategoryChange}
        currentCategory={category}
        currentSubcategory={subcategory}
      />

      {/* Compact Professional Hero */}
      <div className="relative h-[280px] md:h-[320px] overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src={genaiImage}
            alt="GenAI Innovation"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-4xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 3v18M8 8h12M8 16h12" />
                </svg>
              </div>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 font-medium text-sm">
                Digital Solutions Hub
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-header leading-tight">
              Business <span className="text-orange-400">Innovation</span>{" "}
              Platform
            </h1>
            <p className="text-lg md:text-xl mb-4 text-gray-200 leading-relaxed max-w-3xl">
              Access enterprise-grade applications and submit project requests
              through our centralized digital hub.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/30 px-3 py-1 backdrop-blur-sm text-sm"
              >
                <FileText className="h-3 w-3 mr-2" />
                {apps?.length || 0} Applications Available
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/30 px-3 py-1 backdrop-blur-sm text-sm"
              >
                Secure & Compliant
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Applications Section */}
      <main className="bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Business Applications
              </h2>
              <p className="text-gray-600">
                Access your enterprise tools and digital solutions
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Badge variant="secondary" className="text-sm">
                {apps?.length || 0} Available
              </Badge>
              {(search || category !== "all" || subcategory !== "all") && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Applications Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : apps && apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400 h-8 w-8" />
                </div>
                {search || category !== "all" || subcategory !== "all" ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Results Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No applications match your current filters
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Clear All Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Applications
                    </h3>
                    <p className="text-gray-600">
                      Applications will appear here once they're added through
                      the Admin Panel
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Industry Insights Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Industry Insights
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay informed with the latest trends, research, and thought
              leadership from PwC experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - Container Operations */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-orange-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-1 p-4">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-sm ${
                          i % 3 === 0
                            ? "bg-orange-400"
                            : i % 3 === 1
                              ? "bg-blue-400"
                              : "bg-teal-400"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  Container train operations after 20 years of deregulation
                </h3>
              </div>
            </div>

            {/* Card 2 - Insurance Growth */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-16 bg-gray-400 rounded-sm opacity-70"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  Unlocking growth opportunities in India's insurance sector
                </h3>
              </div>
            </div>

            {/* Card 3 - Rural Banking */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-300 rounded-full"></div>
                    <div className="absolute top-4 left-4 w-8 h-8 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  Perspectives on 'One State One RRB': Building a resilient and
                  efficient rural banking system
                </h3>
              </div>
            </div>

            {/* Card 4 - Global Workforce Migration */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-6 gap-1 p-4">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i % 4 === 0
                            ? "bg-purple-400"
                            : i % 4 === 1
                              ? "bg-blue-400"
                              : i % 4 === 2
                                ? "bg-orange-400"
                                : "bg-teal-400"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  Making the case for global workforce migration
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Requisition Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50">
        {/* Call-to-Action Banner */}
        <div className="relative h-[200px] md:h-[220px] overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img
              src={genaiCircleImage}
              alt="GenAI Innovation"
              className="w-full h-full object-cover object-center"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white max-w-2xl relative z-10">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 mb-3 w-fit border border-white/20">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-xs font-medium">Project Services</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">
                Ready to Start Your Project?
              </h2>
              <p className="text-base md:text-lg mb-4 leading-relaxed drop-shadow-md">
                Submit your requirements and connect with our expert team to
                bring your digital transformation ideas to life.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-black/50 text-white border-white/30 px-3 py-1 backdrop-blur-sm text-xs">
                  Fast Response
                </Badge>
                <Badge className="bg-black/50 text-white border-white/30 px-3 py-1 backdrop-blur-sm text-xs">
                  Expert Review
                </Badge>
                <Badge className="bg-black/50 text-white border-white/30 px-3 py-1 backdrop-blur-sm text-xs">
                  Tailored Solutions
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProjectRequisitionForm />
        </div>
      </section>
    </div>
  );
}
