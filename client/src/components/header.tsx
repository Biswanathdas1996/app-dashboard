import { useLocation, Link } from "wouter";
import { Search, Settings } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/30 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="transition-transform hover:scale-105 duration-200">
              <PwCLogo size="md" />
            </div>
            <div className="hidden sm:block">
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                  ET Labs
                </h1>
                <p className="text-sm font-medium text-primary/80 tracking-wide leading-none mt-0.5">
                  Ideas Hub
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Only show on dashboard */}
          {location.includes("/app-dashboard") && onCategoryChange && (
            <div className="hidden md:flex items-center flex-1 justify-center max-w-2xl mx-4">
              <NavigationMenu 
                onCategoryChange={onCategoryChange}
                currentCategory={currentCategory}
                currentSubcategory={currentSubcategory}
              />
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Only show on dashboard */}
            {location.includes("/app-dashboard") && onSearchChange && (
              <div className="hidden lg:flex items-center">
                <div className="relative w-80">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="text-gray-400 h-4 w-4" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search applications..."
                    value={searchValue || ""}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-11 pr-4 py-2.5 h-10 bg-gradient-to-r from-gray-50/80 to-white/90 border border-gray-200/40 rounded-xl focus:bg-white focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm placeholder:text-gray-400 hover:bg-white/90 shadow-sm hover:shadow-md backdrop-blur-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* New Request Button */}
            <Button 
              variant="outline"
              size="sm"
              className="font-semibold"
              onClick={() => {
                console.log('New Request button clicked'); // Debug log
                const requisitionSection = document.getElementById('project-requisition');
                console.log('Found section:', requisitionSection); // Debug log
                if (requisitionSection) {
                  requisitionSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                } else {
                  console.error('Project requisition section not found');
                }
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              New Request
            </Button>

            {/* Dashboard Link - Show when not on dashboard */}
            {!location.includes("/app-dashboard/") && (
              <Link href="/app-dashboard/">
                <Button 
                  variant="outline"
                  size="sm"
                  className="font-semibold"
                >
                  Dashboard
                </Button>
              </Link>
            )}
          </div>


        </div>

        {/* Mobile Navigation and Search - Only show on dashboard */}
        {location.includes("/app-dashboard") && onSearchChange && (
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="text-gray-400 h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-4 py-2.5 h-10 bg-gradient-to-r from-gray-50/80 to-white/90 border border-gray-200/40 rounded-xl focus:bg-white focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm placeholder:text-gray-400 hover:bg-white/90 shadow-sm hover:shadow-md backdrop-blur-sm font-medium"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}