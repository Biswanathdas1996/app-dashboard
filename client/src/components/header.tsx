import { useLocation, Link } from "wouter";
import { Search, ArrowRight } from "lucide-react";
import { PwCLogo } from "./pwc-logo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <PwCLogo size="md" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold text-gray-900 tracking-tight leading-none font-header">
                ET Labs
              </h1>
              <p className="text-xs font-semibold text-primary tracking-wide leading-none mt-0.5 uppercase">
                Ideas Hub
              </p>
            </div>
          </div>

          {location === "/" && onCategoryChange && (
            <div className="hidden md:flex items-center flex-1 justify-center max-w-xl mx-4">
              <NavigationMenu 
                onCategoryChange={onCategoryChange}
                currentCategory={currentCategory}
                currentSubcategory={currentSubcategory}
              />
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {location === "/" && onSearchChange && (
              <div className="hidden lg:flex items-center">
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="text-gray-400 h-4 w-4" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchValue || ""}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-4 h-9 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            <Button 
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold text-sm h-9 px-4 transition-all shadow-sm hover:shadow-md"
              onClick={() => {
                const requisitionSection = document.getElementById('project-requisition');
                if (requisitionSection) {
                  requisitionSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
            >
              New Request
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>

        {location === "/" && onSearchChange && (
          <div className="md:hidden pb-3 space-y-2">
            {onCategoryChange && (
              <div className="overflow-x-auto scrollbar-hide -mx-1">
                <NavigationMenu 
                  onCategoryChange={onCategoryChange}
                  currentCategory={currentCategory}
                  currentSubcategory={currentSubcategory}
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="text-gray-400 h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 h-9 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all text-sm placeholder:text-gray-400"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
