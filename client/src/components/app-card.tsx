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
        className="group relative bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {/* Modern gradient border on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        
        <div className="relative p-4">
          {/* Compact header with app icon and title */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`w-10 h-10 bg-gradient-to-br ${gradientClasses} rounded-xl flex items-center justify-center shadow-sm ${shadowClass} group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}>
                <i className={`${app.icon} text-white text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-1 font-header mb-1">
                  {app.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`${bgClass} ${textClass} border ${borderClass} font-medium text-xs px-2 py-0.5 rounded-md`}
                  >
                    {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                  </Badge>
                  {app.subcategory && (
                    <span className="text-xs text-gray-500 font-medium truncate">
                      {app.subcategory}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 text-gray-400 hover:text-primary"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Compact description */}
          <div className="mb-3">
            {app.shortDescription ? (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {app.shortDescription}
              </p>
            ) : (
              <RichTextViewer 
                content={app.description || ""} 
                maxLines={2} 
                className="text-gray-600 text-sm leading-relaxed"
              />
            )}
          </div>
          
          {/* Bottom row with files and launch */}
          <div className="flex items-center justify-between">
            {/* File attachments */}
            <div className="flex items-center gap-1 flex-1">
              {app.attachments && app.attachments.length > 0 && (
                <>
                  {app.attachments.slice(0, 2).map((filename, index) => {
                    const originalName = filename.split('-').slice(1).join('-') || filename;
                    const fileExtension = originalName.split('.').pop()?.toLowerCase() || '';
                    
                    const getFileIcon = () => {
                      switch (fileExtension) {
                        case 'pdf':
                          return <FileText className="h-3 w-3 text-red-500" />;
                        case 'doc':
                        case 'docx':
                          return <FileText className="h-3 w-3 text-blue-500" />;
                        case 'txt':
                        case 'rtf':
                          return <FileText className="h-3 w-3 text-gray-500" />;
                        default:
                          return <FileText className="h-3 w-3 text-blue-500" />;
                      }
                    };
                    
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/api/files/${filename}`, '_blank');
                        }}
                        className="flex items-center space-x-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 hover:border-gray-300 transition-all duration-150"
                        title={`View ${originalName}`}
                      >
                        {getFileIcon()}
                        <span className="truncate max-w-16">{originalName}</span>
                      </button>
                    );
                  })}
                  {app.attachments.length > 2 && (
                    <span className="text-xs text-gray-500 ml-1">
                      +{app.attachments.length - 2} more
                    </span>
                  )}
                </>
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
              className="h-8 px-3 text-xs text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
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