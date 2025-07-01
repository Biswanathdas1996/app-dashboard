import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { PwCLogo } from "./pwc-logo";
import { Input } from "./ui/input";
import { NavigationMenu } from "./navigation-menu";

interface HeaderProps {
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  onCategoryChange?: (category: string, subcategory?: string) => void;
  currentCategory?: string;
  currentSubcategory?: string;
}

export function Header({ onSearchChange, searchValue, onCategoryChange, currentCategory, currentSubcategory }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="transition-transform hover:scale-105 duration-200">
              <PwCLogo size="md" />
            </div>
          </div>

          {/* Navigation Menu - Only show on dashboard */}
          {location === "/" && onCategoryChange && (
            <div className="hidden md:flex items-center flex-1 justify-center max-w-2xl mx-4">
              <NavigationMenu 
                onCategoryChange={onCategoryChange}
                currentCategory={currentCategory}
                currentSubcategory={currentSubcategory}
              />
            </div>
          )}

          {/* Search Bar - Only show on dashboard */}
          {location === "/" && onSearchChange && (
            <div className="hidden lg:flex items-center">
              <div className="relative w-72">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="text-gray-400 h-4 w-4" />
                </div>
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 h-9 bg-gray-50/70 border-gray-200/50 rounded-lg focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm placeholder:text-gray-400 hover:bg-gray-100/50"
                />
              </div>
            </div>
          )}


        </div>

        {/* Mobile Navigation and Search - Only show on dashboard */}
        {location === "/" && onSearchChange && (
          <div className="md:hidden px-4 pb-4 space-y-3">
            {/* Mobile Navigation */}
            {onCategoryChange && (
              <div className="overflow-x-auto scrollbar-hide">
                <NavigationMenu 
                  onCategoryChange={onCategoryChange}
                  currentCategory={currentCategory}
                  currentSubcategory={currentSubcategory}
                />
              </div>
            )}
            
            {/* Mobile Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="text-gray-400 h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 h-9 bg-gray-50/70 border-gray-200/50 rounded-lg focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm placeholder:text-gray-400 hover:bg-gray-100/50"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}