import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppCard } from "@/components/app-card";
import { useApps, useCategories } from "@/hooks/use-apps";
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
  const { data: categoriesData } = useCategories();

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setSubcategory("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearchChange={setSearch} searchValue={search} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-header">
                Web Applications Directory
              </h1>
              <p className="text-xl opacity-90 font-body">
                Discover and access your business applications
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
                {apps?.length || 0} Applications
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Filters Section */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Filter & Discover</h3>
              </div>
              <p className="text-gray-600 font-medium">Explore applications by category and find exactly what you need</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 tracking-wide">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-56 h-12 rounded-xl border-gray-200/60 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-medium">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200/50 shadow-xl bg-white/95 backdrop-blur-sm">
                    <SelectItem value="all" className="rounded-lg font-medium">All Categories</SelectItem>
                    {categoriesData?.categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-lg font-medium">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 tracking-wide">Subcategory</label>
                <Select value={subcategory} onValueChange={setSubcategory}>
                  <SelectTrigger className="w-56 h-12 rounded-xl border-gray-200/60 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-medium">
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200/50 shadow-xl bg-white/95 backdrop-blur-sm">
                    <SelectItem value="all" className="rounded-lg font-medium">All Subcategories</SelectItem>
                    {categoriesData?.subcategories.map((subcat) => (
                      <SelectItem key={subcat} value={subcat} className="rounded-lg font-medium">
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col justify-end">
                <Button 
                  onClick={handleClearFilters} 
                  variant="outline" 
                  className="h-12 px-6 rounded-xl border-gray-300 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 font-semibold"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

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
            {apps.map((app) => (
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
    </div>
  );
}
