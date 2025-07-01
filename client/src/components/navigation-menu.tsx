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
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Filter to only show active categories
  const categories = allCategories.filter((category: any) => category.isActive);

  const getCategorySubcategories = (categoryId: number) => {
    return allSubcategories.filter((sub: any) => sub.categoryId === categoryId && sub.isActive);
  };

  const handleCategorySelect = (categoryName: string, subcategoryName?: string) => {
    onCategoryChange(categoryName, subcategoryName);
    // Close dropdown after selection
    setHoveredCategory(null);
  };

  const handleMouseEnter = (categoryId: number) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // Small delay to prevent flickering
    setDropdownTimeout(timeout);
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 bg-gradient-to-r from-white to-gray-50/80 rounded-xl p-1.5 border border-gray-200/40 shadow-lg backdrop-blur-md min-w-fit" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* All Categories */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCategorySelect("all")}
        className={cn(
          "h-9 px-4 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden nav-hover-effect",
          currentCategory === "all" 
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105" 
            : "text-gray-700 hover:text-gray-900 hover:bg-white/90 hover:shadow-lg backdrop-blur-sm"
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
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategorySelect(category.name)}
                className={cn(
                  "h-9 px-4 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden group nav-hover-effect",
                  isActive 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/90 hover:shadow-lg backdrop-blur-sm"
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
                <div className="absolute top-full left-0 mt-2 min-w-56 border border-gray-200/60 shadow-2xl bg-white/98 backdrop-blur-lg rounded-2xl p-2 z-50 dropdown-enter">
                  {/* Arrow pointer */}
                  <div className="absolute -top-1 left-6 w-2 h-2 bg-white border-l border-t border-gray-200/60 rotate-45"></div>
                  
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    className={cn(
                      "w-full text-left font-semibold cursor-pointer text-sm rounded-xl px-4 py-3 transition-all duration-200 group relative overflow-hidden",
                      isActive && !currentSubcategory 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-[1.02]" 
                        : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:text-gray-900 hover:shadow-md hover:scale-[1.01]"
                    )}
                  >
                    <span className="relative z-10 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-current opacity-60 mr-3"></div>
                      All {category.name}
                    </span>
                    {isActive && !currentSubcategory && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    )}
                  </button>
                  
                  <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  
                  {categorySubcategories.map((subcategory: any, index: number) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleCategorySelect(category.name, subcategory.name)}
                      className={cn(
                        "w-full text-left cursor-pointer text-sm rounded-xl px-4 py-2.5 transition-all duration-200 group relative overflow-hidden",
                        isActive && currentSubcategory === subcategory.name 
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-[1.02]" 
                          : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-600 hover:text-gray-900 hover:shadow-sm hover:scale-[1.01]"
                      )}
                      style={{ 
                        animationDelay: `${index * 30}ms`,
                        animation: hoveredCategory === category.id ? 'slideInLeft 0.2s ease-out forwards' : 'none'
                      }}
                    >
                      <span className="relative z-10 flex items-center">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-200",
                          isActive && currentSubcategory === subcategory.name ? "bg-white" : "bg-current opacity-40"
                        )}></div>
                        {subcategory.name}
                      </span>
                      {isActive && currentSubcategory === subcategory.name && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      )}
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
                "h-9 px-4 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden nav-hover-effect",
                isActive 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105" 
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/90 hover:shadow-lg backdrop-blur-sm"
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