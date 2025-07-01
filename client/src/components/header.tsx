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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <PwCLogo size="md" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900">
                Web Application Directory
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar - Only show on dashboard */}
          {location === "/" && onSearchChange && (
            <div className="hidden sm:flex items-center space-x-2 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link href={item.path} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className={isActive ? "font-medium text-primary" : ""}>
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
          <div className="sm:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}