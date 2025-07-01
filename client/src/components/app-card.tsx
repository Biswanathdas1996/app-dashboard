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
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border border-gray-200/60 hover:bg-white shadow-lg hover:shadow-xl transition-all rounded-xl"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
      
      <div className="relative p-6">
        {/* Modern app icon */}
        <div className="mb-5">
          <div className={`relative w-14 h-14 bg-gradient-to-br ${gradientClasses} rounded-2xl flex items-center justify-center shadow-xl ${shadowClass} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-white/20`}>
            <i className={`${app.icon} text-white text-xl`}></i>
          </div>
        </div>

        {/* App info */}
        <div className="mb-4">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors duration-300 leading-tight mb-3 line-clamp-2 font-header">
            {app.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <Badge 
              className={`${bgClass} ${textClass} border ${borderClass} font-semibold text-xs px-3 py-1.5 rounded-full hover:scale-105 transition-transform duration-200`}
            >
              {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
            </Badge>
            {app.subcategory && (
              <Badge 
                variant="outline" 
                className="text-xs text-gray-600 border-gray-300 px-3 py-1.5 rounded-full font-medium bg-gray-50/80"
              >
                {app.subcategory}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Modern description */}
        <div className="mb-5">
          {app.shortDescription ? (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {app.shortDescription}
            </p>
          ) : (
            <RichTextViewer 
              content={app.description || ""} 
              maxLines={3} 
              className="text-gray-600 text-sm leading-relaxed"
            />
          )}
        </div>
        
        {/* Modern file attachments */}
        {app.attachments && app.attachments.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-200/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {app.attachments.length} file{app.attachments.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex gap-1 ml-auto">
                {app.attachments.slice(0, 2).map((filename, index) => {
                  const originalName = filename.split('-').slice(1).join('-') || filename;
                  const fileExtension = originalName.split('.').pop()?.toLowerCase() || '';
                  
                  const getFileColor = () => {
                    switch (fileExtension) {
                      case 'pdf':
                        return 'text-red-600 bg-red-50 hover:bg-red-100';
                      case 'doc':
                      case 'docx':
                        return 'text-blue-600 bg-blue-50 hover:bg-blue-100';
                      case 'txt':
                      case 'rtf':
                        return 'text-gray-600 bg-gray-50 hover:bg-gray-100';
                      default:
                        return 'text-blue-600 bg-blue-50 hover:bg-blue-100';
                    }
                  };
                  
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`h-7 w-7 p-0 ${getFileColor()} rounded-lg transition-all hover:scale-110`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/api/files/${filename}`, '_blank');
                      }}
                      title={`View ${originalName}`}
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                  );
                })}
                {app.attachments.length > 2 && (
                  <div className="flex items-center justify-center h-7 w-7 text-xs text-blue-600 bg-blue-50 rounded-lg font-semibold">
                    +{app.attachments.length - 2}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modern launch button */}
        <Button
          className={`w-full bg-gradient-to-r ${gradientClasses} text-white hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-xl ${shadowClass} rounded-xl font-bold py-3 border-0 group-hover:shadow-2xl`}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Launch App
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
