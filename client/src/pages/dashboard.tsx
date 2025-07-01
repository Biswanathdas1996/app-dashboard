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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Web Applications Directory
              </h1>
              <p className="text-xl opacity-90">
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
        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter Applications</h3>
              <p className="text-gray-600 text-sm">Narrow down your search by category and subcategory</p>
            </div>
            <div className="flex gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData?.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {categoriesData?.subcategories.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : apps && apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-gray-400 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No apps found</h3>
            <p className="text-gray-600 mb-6">
              {search || category || subcategory 
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first web application"
              }
            </p>
            {(search || category || subcategory) ? (
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <p className="text-gray-500">Visit the Admin Panel to add your first app</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
