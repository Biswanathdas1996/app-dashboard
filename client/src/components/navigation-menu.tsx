import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  const categories = allCategories.filter((category: any) => category.isActive);

  const getCategorySubcategories = (categoryId: number) => {
    return allSubcategories.filter((sub: any) => sub.categoryId === categoryId && sub.isActive);
  };

  const handleCategorySelect = (categoryName: string, subcategoryName?: string) => {
    onCategoryChange(categoryName, subcategoryName);
  };

  const calculateVisibleItems = useCallback(() => {
    const container = containerRef.current;
    if (!container || categories.length === 0) return;

    const containerWidth = container.offsetWidth;
    const moreButtonWidth = 70;
    const gap = 4;
    let usedWidth = 0;
    let count = 0;

    const allButton = itemsRef.current[0];
    if (allButton) {
      usedWidth += allButton.scrollWidth + gap;
    }

    for (let i = 0; i < categories.length; i++) {
      const item = itemsRef.current[i + 1];
      if (!item) continue;
      const itemWidth = item.scrollWidth + gap;

      const remainingItems = categories.length - (i + 1);
      const needsMore = remainingItems > 0;
      const availableWidth = containerWidth - (needsMore ? moreButtonWidth : 0);

      if (usedWidth + itemWidth <= availableWidth) {
        usedWidth += itemWidth;
        count++;
      } else {
        break;
      }
    }

    setVisibleCount(count);
  }, [categories.length]);

  useEffect(() => {
    calculateVisibleItems();
    const observer = new ResizeObserver(() => {
      calculateVisibleItems();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [calculateVisibleItems]);

  useEffect(() => {
    if (categories.length > 0) {
      const timer = setTimeout(calculateVisibleItems, 50);
      return () => clearTimeout(timer);
    }
  }, [categories, calculateVisibleItems]);

  if (isLoading) {
    return null;
  }

  const visibleCategories = visibleCount !== null ? categories.slice(0, visibleCount) : categories;
  const overflowCategories = visibleCount !== null ? categories.slice(visibleCount) : [];
  const activeOverflowCategory = overflowCategories.find(c => c.name === currentCategory);

  const renderCategoryButton = (category: any, inDropdown = false) => {
    const categorySubcategories = getCategorySubcategories(category.id);
    const isActive = currentCategory === category.name;

    if (inDropdown) {
      if (categorySubcategories.length > 0) {
        return (
          <div key={category.id}>
            <DropdownMenuItem
              onClick={() => handleCategorySelect(category.name)}
              className={cn(
                "font-medium cursor-pointer text-sm rounded-lg px-3 py-2 transition-colors",
                isActive ? "bg-gray-900 text-white" : "hover:bg-gray-50 text-gray-700"
              )}
            >
              {category.name}
            </DropdownMenuItem>
            {categorySubcategories.map((sub: any) => (
              <DropdownMenuItem
                key={sub.id}
                onClick={() => handleCategorySelect(category.name, sub.name)}
                className={cn(
                  "cursor-pointer text-sm rounded-lg px-3 py-2 pl-6 transition-colors",
                  isActive && currentSubcategory === sub.name
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50 text-gray-500"
                )}
              >
                {sub.name}
              </DropdownMenuItem>
            ))}
          </div>
        );
      }
      return (
        <DropdownMenuItem
          key={category.id}
          onClick={() => handleCategorySelect(category.name)}
          className={cn(
            "cursor-pointer text-sm rounded-lg px-3 py-2 transition-colors",
            isActive ? "bg-gray-900 text-white" : "hover:bg-gray-50 text-gray-700"
          )}
        >
          {category.name}
        </DropdownMenuItem>
      );
    }

    if (categorySubcategories.length > 0) {
      return (
        <DropdownMenu key={category.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0",
                isActive
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {category.name}
              <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-44 border border-gray-200 shadow-xl bg-white rounded-xl p-1.5">
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
    }

    return (
      <Button
        key={category.id}
        variant="ghost"
        size="sm"
        onClick={() => handleCategorySelect(category.name)}
        className={cn(
          "h-8 px-3 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0",
          isActive
            ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        {category.name}
      </Button>
    );
  };

  return (
    <div ref={containerRef} className="flex items-center gap-1 w-full overflow-hidden">
      <Button
        ref={(el) => { itemsRef.current[0] = el; }}
        variant="ghost"
        size="sm"
        onClick={() => handleCategorySelect("all")}
        className={cn(
          "h-8 px-3 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0",
          currentCategory === "all"
            ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        All
      </Button>

      {visibleCategories.map((category, index) => (
        <div
          key={category.id}
          ref={(el) => { itemsRef.current[index + 1] = el; }}
          className="shrink-0"
        >
          {renderCategoryButton(category)}
        </div>
      ))}

      {visibleCount === null && categories.map((category, index) => (
        <div
          key={`measure-${category.id}`}
          ref={(el) => { itemsRef.current[index + 1] = el; }}
          className="shrink-0 invisible absolute"
        >
          {renderCategoryButton(category)}
        </div>
      ))}

      {overflowCategories.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0",
                activeOverflowCategory
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {activeOverflowCategory ? activeOverflowCategory.name : "More"}
              <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44 border border-gray-200 shadow-xl bg-white rounded-xl p-1.5 max-h-80 overflow-y-auto">
            {overflowCategories.map((category) => renderCategoryButton(category, true))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
