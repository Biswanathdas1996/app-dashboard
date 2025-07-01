import { Link, useLocation } from "wouter";
import { Home, Settings, Search, Menu } from "lucide-react";
import { PwCLogo } from "./pwc-logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onSearchChange?: (search: string) => void;
  searchValue?: string;
}

export function Header({ onSearchChange, searchValue }: HeaderProps) {
  const [location] = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      path: "/admin",
      label: "Admin Panel",
      icon: Settings,
    },
  ];

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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className="relative group">
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`nav-item flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        isActive 
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm"
                      }`}
                    >
                      <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="relative">{item.label}</span>
                    </Button>
                    {isActive && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-primary rounded-full animate-pulse"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

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

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 mt-2 rounded-xl border border-gray-200/50 shadow-lg bg-white/95 backdrop-blur-sm"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link href={item.path} className="flex items-center space-x-3 px-4 py-3 rounded-lg">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
                          <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                        </div>
                        <span className={`font-medium ${isActive ? "text-primary" : "text-gray-700"}`}>
                          {item.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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