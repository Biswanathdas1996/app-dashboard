import { ExternalLink, FileText, Eye } from "lucide-react";
import { useState } from "react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AppDetailsModal } from "./app-details-modal";

interface AppCardProps {
  app: WebApp;
  onClick?: (app: WebApp) => void;
}

const categoryColors = {
  productivity: "from-primary to-accent shadow-primary/20 bg-primary/10 text-primary border-primary/20",
  development: "from-emerald-500 to-emerald-600 shadow-emerald-500/20 bg-emerald-50 text-emerald-700 border-emerald-200",
  marketing: "from-purple-500 to-purple-600 shadow-purple-500/20 bg-purple-50 text-purple-700 border-purple-200",
  finance: "from-amber-500 to-amber-600 shadow-amber-500/20 bg-amber-50 text-amber-700 border-amber-200",
  design: "from-rose-500 to-rose-600 shadow-rose-500/20 bg-rose-50 text-rose-700 border-rose-200",
  analytics: "from-indigo-500 to-indigo-600 shadow-indigo-500/20 bg-indigo-50 text-indigo-700 border-indigo-200",
} as const;

export function AppCard({ app, onClick }: AppCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const colorClasses = categoryColors[app.category as keyof typeof categoryColors] || 
    "from-slate-500 to-slate-600 shadow-slate-500/20 bg-slate-50 text-slate-700 border-slate-200";
  
  const colorParts = colorClasses.split(' ');
  const gradientClasses = colorParts.slice(0, 2).join(' ');
  const shadowClass = colorParts[2];
  const bgClass = colorParts[3];
  const textClass = colorParts[4];
  const borderClass = colorParts[5];
  
  const handleClick = () => {
    if (onClick) {
      onClick(app);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  return (
    <>
      <div 
        className="group relative bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        
        <div className="relative p-3">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className={`w-8 h-8 bg-gradient-to-br ${gradientClasses} rounded-lg flex items-center justify-center ${shadowClass} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                <i className={`${app.icon} text-white text-xs`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-1 font-header">
                  {app.name}
                </h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 p-0 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>

          {/* Category and subcategory */}
          <div className="flex items-center gap-1.5 mb-2">
            <Badge 
              variant="secondary" 
              className={`${bgClass} ${textClass} border ${borderClass} font-medium text-[10px] px-1.5 py-0.5 rounded-md h-5`}
            >
              {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
            </Badge>
            {app.subcategory && (
              <span className="text-[10px] text-gray-500 font-medium truncate bg-gray-50 px-1.5 py-0.5 rounded-md">
                {app.subcategory}
              </span>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-2">
            {app.shortDescription ? (
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                {app.shortDescription}
              </p>
            ) : (
              <RichTextViewer 
                content={app.description || ""} 
                maxLines={2} 
                className="text-gray-600 text-xs leading-relaxed"
              />
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-50">
            {/* File attachments */}
            <div className="flex items-center gap-1">
              {app.attachments && app.attachments.length > 0 ? (
                <>
                  <FileText className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] text-gray-500 font-medium">
                    {app.attachments.length} file{app.attachments.length > 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <div className="h-3"></div>
              )}
            </div>
            
            {/* Launch button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(app.url, '_blank', 'noopener,noreferrer');
              }}
              className="h-6 px-2 text-[10px] text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors duration-200 rounded-md font-medium"
            >
              <ExternalLink className="h-2.5 w-2.5 mr-1" />
              Launch
            </Button>
          </div>
        </div>
      </div>

      <AppDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        app={app}
      />
    </>
  );
}