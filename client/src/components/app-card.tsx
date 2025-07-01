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
      className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/40 hover:shadow-xl hover:shadow-primary/8 hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-250"></div>
      
      <div className="relative p-6">
        {/* Compact header */}
        <div className="flex items-center mb-4">
          <div className={`relative w-12 h-12 bg-gradient-to-br ${gradientClasses} rounded-xl flex items-center justify-center shadow-sm ${shadowClass} group-hover:scale-105 transition-transform duration-200`}>
            <i className={`${app.icon} text-white text-lg`}></i>
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors duration-200 leading-tight mb-1 line-clamp-1 font-header">
              {app.name}
            </h3>
            <Badge 
              variant="secondary" 
              className={`${bgClass} ${textClass} border ${borderClass} font-medium text-xs px-2.5 py-0.5 rounded-lg hover:scale-105 transition-transform duration-150`}
            >
              {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
            </Badge>
          </div>
        </div>
        
        {/* Compact description */}
        <div className="mb-4">
          {app.shortDescription ? (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {app.shortDescription}
            </p>
          ) : (
            <RichTextViewer 
              content={app.description} 
              maxLines={2} 
              className="text-gray-600 text-sm leading-relaxed"
            />
          )}
        </div>
        
        {/* File attachments */}
        {app.attachments && app.attachments.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
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
                    className="flex items-center space-x-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-150 group/file"
                    title={`View ${originalName}`}
                  >
                    <span className="group-hover/file:scale-110 transition-transform">
                      {getFileIcon()}
                    </span>
                    <span className="font-medium max-w-20 truncate">
                      {originalName.length > 15 ? `${originalName.substring(0, 12)}...` : originalName}
                    </span>
                  </button>
                );
              })}
              {app.attachments.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded-md">
                  +{app.attachments.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Compact footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 bg-gray-50/80 px-2 py-1 rounded-md">
            {app.subcategory}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="h-8 w-8 p-0 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1 text-primary group-hover:text-accent transition-colors">
              <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">Launch</span>
              <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
        </div>
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
