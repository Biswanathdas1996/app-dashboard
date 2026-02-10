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
    <nav className="flex items-center gap-1 p-1 min-w-fit">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCategorySelect("all")}
        className={cn(
          "h-8 px-3.5 text-sm font-medium rounded-full transition-all duration-200",
          currentCategory === "all" 
            ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        All
      </Button>

      {categories.map((category) => {
        const categorySubcategories = getCategorySubcategories(category.id);
        const isActive = currentCategory === category.name;
        
        if (categorySubcategories.length > 0) {
          return (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3.5 text-sm font-medium rounded-full transition-all duration-200",
                    isActive 
                      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {category.name}
                  <ChevronDown className={cn(
                    "ml-1 h-3 w-3 transition-transform",
                    isActive ? "opacity-90" : "opacity-50"
                  )} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48 border border-gray-200 shadow-xl bg-white rounded-xl p-1.5">
                <DropdownMenuItem 
                  onClick={() => handleCategorySelect(category.name)}
                  className={cn(
                    "font-medium cursor-pointer text-sm rounded-lg px-3 py-2 transition-colors",
                    isActive && currentSubcategory === "all" 
                      ? "bg-gray-900 text-white" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  All {category.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-2 my-1" />
                {categorySubcategories.map((subcategory: any) => (
                  <DropdownMenuItem 
                    key={subcategory.id}
                    onClick={() => handleCategorySelect(category.name, subcategory.name)}
                    className={cn(
                      "cursor-pointer text-sm rounded-lg px-3 py-2 transition-colors",
                      isActive && currentSubcategory === subcategory.name 
                        ? "bg-gray-900 text-white" 
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    {subcategory.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        } else {
          return (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              onClick={() => handleCategorySelect(category.name)}
              className={cn(
                "h-8 px-3.5 text-sm font-medium rounded-full transition-all duration-200",
                isActive 
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
