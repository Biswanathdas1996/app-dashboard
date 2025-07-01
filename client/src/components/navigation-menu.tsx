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
  const { data: categories = [], isLoading } = useCategories();
  const { data: allSubcategories = [] } = useSubcategories();

  const getCategorySubcategories = (categoryId: number) => {
    return allSubcategories.filter((sub: any) => sub.categoryId === categoryId);
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
    <nav className="flex items-center space-x-0.5 bg-gray-50/50 rounded-lg p-1 border border-gray-200/60 min-w-fit"  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* All Categories */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCategorySelect("all")}
        className={cn(
          "h-8 px-3 text-sm font-medium rounded-md transition-all duration-200",
          currentCategory === "all" 
            ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" 
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
        )}
      >
        All
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
                    "h-8 px-3 text-sm font-medium rounded-md transition-all duration-200",
                    isActive 
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  )}
                >
                  {shortName}
                  <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48 border border-gray-200/60 shadow-lg bg-white/95 backdrop-blur-sm">
                <DropdownMenuItem 
                  onClick={() => handleCategorySelect(category.name)}
                  className={cn(
                    "font-medium cursor-pointer text-sm",
                    isActive && currentSubcategory === "all" && "bg-primary/10 text-primary"
                  )}
                >
                  All {category.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200/60" />
                {categorySubcategories.map((subcategory: any) => (
                  <DropdownMenuItem 
                    key={subcategory.id}
                    onClick={() => handleCategorySelect(category.name, subcategory.name)}
                    className={cn(
                      "cursor-pointer text-sm",
                      currentSubcategory === subcategory.name && "bg-primary/10 text-primary"
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
                "h-8 px-3 text-sm font-medium rounded-md transition-all duration-200",
                isActive 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              {shortName}
            </Button>
          );
        }
      })}
    </nav>
  );
}