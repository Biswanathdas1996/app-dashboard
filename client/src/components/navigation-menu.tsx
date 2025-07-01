import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories, useSubcategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

interface NavigationMenuProps {
  onCategoryChange: (category: string, subcategory?: string) => void;
  currentCategory?: string;
  currentSubcategory?: string;
}

export function NavigationMenu({ onCategoryChange, currentCategory, currentSubcategory }: NavigationMenuProps) {
  const { data: allCategories = [], isLoading } = useCategories();
  const { data: allSubcategories = [] } = useSubcategories();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  
  // Filter to only show active categories
  const categories = allCategories.filter((category: any) => category.isActive);

  const getCategorySubcategories = (categoryId: number) => {
    return allSubcategories.filter((sub: any) => sub.categoryId === categoryId && sub.isActive);
  };

  const handleCategorySelect = (categoryName: string, subcategoryName?: string) => {
    onCategoryChange(categoryName, subcategoryName);
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 bg-gradient-to-r from-white to-gray-50/80 rounded-xl p-1.5 border border-gray-200/40 shadow-sm backdrop-blur-sm min-w-fit" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* All Categories */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCategorySelect("all")}
        className={cn(
          "h-9 px-4 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden",
          currentCategory === "all" 
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105" 
            : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md hover:scale-102 backdrop-blur-sm"
        )}
      >
        <span className="relative z-10">All</span>
        {currentCategory === "all" && (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 animate-pulse" />
        )}
      </Button>

      {/* Category Menu Items */}
      {categories.map((category) => {
        const categorySubcategories = getCategorySubcategories(category.id);
        const isActive = currentCategory === category.name;
        
        // Use full category name from app.json
        const shortName = category.name;
        
        // If category has subcategories, show as hover dropdown
        if (categorySubcategories.length > 0) {
          return (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategorySelect(category.name)}
                className={cn(
                  "h-9 px-4 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden group",
                  isActive 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md hover:scale-102 backdrop-blur-sm"
                )}
              >
                <span className="relative z-10 flex items-center">
                  {shortName}
                  <ChevronDown className={cn(
                    "ml-1.5 h-3 w-3 transition-all duration-300",
                    hoveredCategory === category.id ? "rotate-180" : "rotate-0",
                    isActive ? "opacity-90" : "opacity-60 group-hover:opacity-80"
                  )} />
                </span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 animate-pulse" />
                )}
              </Button>
              
              {/* Hover dropdown content */}
              {hoveredCategory === category.id && (
                <div className="absolute top-full left-0 mt-1 min-w-52 border border-gray-200/40 shadow-xl bg-white/95 backdrop-blur-md rounded-xl p-1 z-50">
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    className={cn(
                      "w-full text-left font-semibold cursor-pointer text-sm rounded-lg mx-1 my-0.5 px-3 py-2.5 transition-all duration-200",
                      isActive && !currentSubcategory 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm" 
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    )}
                  >
                    All {category.name}
                  </button>
                  <div className="mx-2 my-1 h-px bg-gray-200/50" />
                  {categorySubcategories.map((subcategory: any) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleCategorySelect(category.name, subcategory.name)}
                      className={cn(
                        "w-full text-left cursor-pointer text-sm rounded-lg mx-1 my-0.5 px-3 py-2.5 transition-all duration-200",
                        isActive && currentSubcategory === subcategory.name 
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm" 
                          : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        } else {
          // If no subcategories, make category directly clickable
          return (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              onClick={() => handleCategorySelect(category.name)}
              className={cn(
                "h-9 px-4 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105" 
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md hover:scale-102 backdrop-blur-sm"
              )}
            >
              <span className="relative z-10">{shortName}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 animate-pulse" />
              )}
            </Button>
          );
        }
      })}
    </nav>
  );
}