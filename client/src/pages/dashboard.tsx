import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/app-card";
import { ProjectRequisitionForm } from "@/components/project-requisition-form";
import { useApps } from "@/hooks/use-apps";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");

  const { data: apps, isLoading } = useApps(
    search, 
    category === "all" ? "" : category, 
    subcategory === "all" ? "" : subcategory
  );

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setSubcategory("all");
  };

  const handleCategoryChange = (newCategory: string, newSubcategory?: string) => {
    setCategory(newCategory);
    if (newSubcategory) {
      setSubcategory(newSubcategory);
    } else {
      setSubcategory("all");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        onSearchChange={setSearch} 
        searchValue={search}
        onCategoryChange={handleCategoryChange}
        currentCategory={category}
        currentSubcategory={subcategory}
      />
      
      {/* Compact Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-header">
                PwC Digital Hub
              </h1>
              <p className="text-lg md:text-xl opacity-95 font-body">
                Innovative business solutions & digital transformation
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30 text-sm font-medium">
                <FileText className="h-4 w-4 mr-2" />
                {apps?.length || 0} Solutions
              </Badge>
            </div>
          </div>
        </div>
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>



      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Apps Grid with modern compact design */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : apps && apps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {(apps || []).map((app) => (
              <AppCard 
                key={app.id} 
                app={app} 
                onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {search || category !== "all" || subcategory !== "all" ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 max-w-sm mx-auto border border-white/50">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400 h-8 w-8" />
                </div>
                <p className="text-gray-600 mb-4 font-medium">No applications match your filters</p>
                <Button 
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="font-medium"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 max-w-sm mx-auto border border-white/50">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-orange-500 h-8 w-8" />
                </div>
                <p className="text-gray-600 mb-2 font-medium">No applications yet</p>
                <p className="text-sm text-gray-500">
                  Visit the <span className="text-primary font-semibold">Admin Panel</span> to add applications
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* What's New Section */}
      <section className="bg-white/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">What's new</h2>
            <p className="text-gray-600">Latest insights and updates</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                          i % 3 === 0 ? 'bg-orange-400' : i % 3 === 1 ? 'bg-blue-400' : 'bg-teal-400'
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
                      <div key={i} className="w-8 h-16 bg-gray-400 rounded-sm opacity-70"></div>
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
                  Perspectives on 'One State One RRB': Building a resilient and efficient rural banking system
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
                          i % 4 === 0 ? 'bg-purple-400' : i % 4 === 1 ? 'bg-blue-400' : i % 4 === 2 ? 'bg-orange-400' : 'bg-teal-400'
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

      {/* Project Requisition Form Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-t border-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectRequisitionForm />
        </div>
      </section>
    </div>
  );
}
