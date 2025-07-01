import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  
  // Filter to only show active categories
  const categories = allCategories.filter((category: any) => category.isActive);

  const getCategorySubcategories = (categoryId: number) => {
    return allSubcategories.filter((sub: any) => sub.categoryId === categoryId && sub.isActive);
  };

  const handleCategorySelect = (categoryName: string, subcategoryName?: string) => {
    onCategoryChange(categoryName, subcategoryName);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-0.5 bg-gray-50/50 rounded-lg p-1 border border-gray-200/60">
        <div className="w-12 h-8 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-20 h-8 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-18 h-8 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    );
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
        
        // Shorten category names for compact display
        const shortName = category.name
          .replace('Financial Services', 'Finance')
          .replace('Healthcare & Life Sciences', 'Healthcare')
          .replace('Government & Public Services', 'Government')
          .replace('Infrastructure & Real Estate', 'Infrastructure');
        
        // If category has subcategories, show as dropdown
        if (categorySubcategories.length > 0) {
          return (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
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
                      isActive ? "opacity-90" : "opacity-60 group-hover:opacity-80"
                    )} />
                  </span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 animate-pulse" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-52 border border-gray-200/40 shadow-xl bg-white/95 backdrop-blur-md rounded-xl p-1">
                <DropdownMenuItem 
                  onClick={() => handleCategorySelect(category.name)}
                  className={cn(
                    "font-semibold cursor-pointer text-sm rounded-lg mx-1 my-0.5 px-3 py-2.5 transition-all duration-200",
                    isActive && currentSubcategory === "all" 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm" 
                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  )}
                >
                  All {category.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-2 my-1 bg-gray-200/50" />
                {categorySubcategories.map((subcategory: any) => (
                  <DropdownMenuItem 
                    key={subcategory.id}
                    onClick={() => handleCategorySelect(category.name, subcategory.name)}
                    className={cn(
                      "cursor-pointer text-sm rounded-lg mx-1 my-0.5 px-3 py-2.5 transition-all duration-200",
                      isActive && currentSubcategory === subcategory.name 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm" 
                        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {subcategory.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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