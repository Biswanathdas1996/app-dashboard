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
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearchChange={setSearch} 
        searchValue={search}
        onCategoryChange={handleCategoryChange}
        currentCategory={category}
        currentSubcategory={subcategory}
      />
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-header">
              Welcome to PwC Digital Hub
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-95 font-body max-w-3xl mx-auto">
              Your gateway to innovative business solutions and digital transformation tools
            </p>
            <div className="flex justify-center items-center">
              <Badge variant="secondary" className="text-lg px-6 py-3 bg-white/20 text-white border-white/30">
                <FileText className="h-5 w-5 mr-2" />
                {apps?.length || 0} Digital Solutions Available
              </Badge>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>



      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Compact Apps Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/40 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : apps && apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {(apps || []).map((app) => (
              <AppCard 
                key={app.id} 
                app={app} 
                onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
              />
            ))}
          </div>
        ) : (
          /* Modern Empty State */
          <div className="text-center py-20">
            <div className="relative mx-auto mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <FileText className="text-primary h-12 w-12" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full opacity-20"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-accent to-primary rounded-full opacity-30"></div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {search || category || subcategory ? "No matches found" : "Ready to get started?"}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {search || category || subcategory 
                ? "We couldn't find any applications matching your criteria. Try adjusting your filters or search terms."
                : "Your application portfolio is waiting to be built. Add your first web application to begin."
              }
            </p>
            {(search || category || subcategory) ? (
              <Button 
                onClick={handleClearFilters} 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Clear All Filters
              </Button>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-gray-700 font-medium">
                  Visit the <span className="text-primary font-bold">Admin Panel</span> to add your first application
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* What's New Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">What's new</h2>
            <p className="text-lg text-gray-600">What's new</p>
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
      <section className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectRequisitionForm />
        </div>
      </section>
    </div>
  );
}
