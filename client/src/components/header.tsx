import { useLocation, Link } from "wouter";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PwCLogo } from "./pwc-logo";
import { Button } from "./ui/button";
import { NavigationMenu } from "./navigation-menu";

interface HeaderProps {
  onCategoryChange?: (category: string, subcategory?: string) => void;
  currentCategory?: string;
  currentSubcategory?: string;
}

export function Header({ onCategoryChange, currentCategory, currentSubcategory }: HeaderProps) {
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
            <div className="hidden md:flex items-center flex-1 justify-center mx-4 min-w-0">
              <NavigationMenu 
                onCategoryChange={onCategoryChange}
                currentCategory={currentCategory}
                currentSubcategory={currentSubcategory}
              />
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            <Button 
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold text-sm h-9 px-4 transition-all shadow-sm hover:shadow-md"
              onClick={() => window.open('https://etlab-projects.pwc.in/agent-marketplace/', '_blank', 'noopener,noreferrer')}
            >
              Agent Store
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Button>
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

        {location === "/" && onCategoryChange && (
          <div className="md:hidden pb-3">
            <div className="w-full min-w-0">
              <NavigationMenu 
                onCategoryChange={onCategoryChange}
                currentCategory={currentCategory}
                currentSubcategory={currentSubcategory}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
