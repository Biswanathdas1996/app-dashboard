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
    <div 
      className="group relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Modern glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white/50 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Floating action button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="h-7 w-7 p-0 bg-white/90 backdrop-blur-sm border border-gray-200/60 hover:bg-white shadow-md hover:shadow-lg transition-all rounded-lg"
        >
          <Eye className="h-3 w-3 text-gray-600" />
        </Button>
      </div>
      
      <div className="relative p-4">
        {/* Compact header with icon and info */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${gradientClasses} rounded-xl flex items-center justify-center shadow-lg ${shadowClass} group-hover:scale-105 transition-all duration-200`}>
            <i className={`${app.icon} text-white text-base`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-1 mb-1">
              {app.name}
            </h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {app.category}
            </p>
          </div>
        </div>
        
        {/* Compact description */}
        {(app.shortDescription || app.description) && (
          <div className="mb-3">
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
        )}
        
        {/* Minimal file indicator */}
        {app.attachments && app.attachments.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <FileText className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{app.attachments.length}</span>
          </div>
        )}

        {/* Compact launch button */}
        <Button
          className={`w-full bg-gradient-to-r ${gradientClasses} text-white hover:opacity-90 transition-all duration-200 shadow-md ${shadowClass} rounded-lg font-medium py-2 text-sm border-0`}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Launch
        </Button>
      </div>

      {/* Details Modal */}
      <AppDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        app={app}
      />
    </div>
  );
}
