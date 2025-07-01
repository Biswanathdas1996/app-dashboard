import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { PwCLogo } from "./pwc-logo";
import { Input } from "./ui/input";

interface HeaderProps {
  onSearchChange?: (search: string) => void;
  searchValue?: string;
}

export function Header({ onSearchChange, searchValue }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <div className="transition-transform hover:scale-105 duration-200">
              <PwCLogo size="md" />
            </div>
            <div className="hidden md:block">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Web Application Directory
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Powered by PwC
                </p>
              </div>
            </div>
          </div>



          {/* Search Bar - Only show on dashboard */}
          {location === "/" && onSearchChange && (
            <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-lg mx-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="text-gray-400 h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-50/70 border-gray-200/50 rounded-xl focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm font-medium placeholder:text-gray-400 hover:bg-gray-100/50 shadow-sm focus:shadow-md"
                />
              </div>
            </div>
          )}


        </div>

        {/* Mobile Search - Only show on dashboard */}
        {location === "/" && onSearchChange && (
          <div className="lg:hidden px-4 pb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="text-gray-400 h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-50/70 border-gray-200/50 rounded-xl focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium placeholder:text-gray-400 hover:bg-gray-100/50 shadow-sm focus:shadow-md"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}