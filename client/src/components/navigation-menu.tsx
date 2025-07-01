import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

  const getCurrentDisplayText = () => {
    if (currentSubcategory && currentSubcategory !== "all") {
      return currentSubcategory;
    }
    if (currentCategory && currentCategory !== "all") {
      return currentCategory;
    }
    return "All Categories";
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "min-w-48 justify-between bg-white border-gray-200 hover:bg-gray-50",
              (currentCategory !== "all" || currentSubcategory !== "all") && "border-primary bg-primary/5"
            )}
          >
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{getCurrentDisplayText()}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto" align="start">
          <DropdownMenuItem 
            onClick={() => handleCategorySelect("all")}
            className={cn(
              "font-medium cursor-pointer",
              currentCategory === "all" && "bg-primary/10 text-primary"
            )}
          >
            All Categories
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {categories.map((category) => {
            const categorySubcategories = getCategorySubcategories(category.id);
            
            // If category has subcategories, show as submenu
            if (categorySubcategories.length > 0) {
              return (
                <DropdownMenuSub key={category.id}>
                  <DropdownMenuSubTrigger 
                    className={cn(
                      "cursor-pointer",
                      currentCategory === category.name && "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="font-medium">{category.name}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    <DropdownMenuItem 
                      onClick={() => handleCategorySelect(category.name)}
                      className={cn(
                        "font-medium cursor-pointer",
                        currentCategory === category.name && currentSubcategory === "all" && "bg-primary/10 text-primary"
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
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              );
            } else {
              // If no subcategories, make category directly clickable
              return (
                <DropdownMenuItem 
                  key={category.id}
                  onClick={() => handleCategorySelect(category.name)}
                  className={cn(
                    "font-medium cursor-pointer",
                    currentCategory === category.name && "bg-primary/10 text-primary"
                  )}
                >
                  {category.name}
                </DropdownMenuItem>
              );
            }
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {(currentCategory !== "all" || currentSubcategory !== "all") && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleCategorySelect("all")}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear Filter
        </Button>
      )}
    </div>
  );
}