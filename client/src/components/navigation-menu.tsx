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
      <div className="flex items-center space-x-4">
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-28 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-1">
      {/* All Categories */}
      <Button
        variant={currentCategory === "all" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleCategorySelect("all")}
        className={cn(
          "font-medium",
          currentCategory === "all" 
            ? "bg-primary text-white" 
            : "text-gray-700 hover:text-primary hover:bg-primary/10"
        )}
      >
        All
      </Button>

      {/* Category Menu Items */}
      {categories.map((category) => {
        const categorySubcategories = getCategorySubcategories(category.id);
        const isActive = currentCategory === category.name;
        
        // If category has subcategories, show as dropdown
        if (categorySubcategories.length > 0) {
          return (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "font-medium",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:text-primary hover:bg-primary/10"
                  )}
                >
                  {category.name}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48">
                <DropdownMenuItem 
                  onClick={() => handleCategorySelect(category.name)}
                  className={cn(
                    "font-medium cursor-pointer",
                    isActive && currentSubcategory === "all" && "bg-primary/10 text-primary"
                  )}
                >
                  All {category.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categorySubcategories.map((subcategory: any) => (
                  <DropdownMenuItem 
                    key={subcategory.id}
                    onClick={() => handleCategorySelect(category.name, subcategory.name)}
                    className={cn(
                      "cursor-pointer",
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
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleCategorySelect(category.name)}
              className={cn(
                "font-medium",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:text-primary hover:bg-primary/10"
              )}
            >
              {category.name}
            </Button>
          );
        }
      })}
    </nav>
  );
}