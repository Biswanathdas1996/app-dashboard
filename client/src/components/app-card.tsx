import { ExternalLink, FileText } from "lucide-react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
import { Badge } from "./ui/badge";

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

  return (
    <div 
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Gradient accent border */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-8">
        {/* Header with icon and title */}
        <div className="flex items-start mb-6">
          <div className={`relative w-16 h-16 bg-gradient-to-br ${gradientClasses} rounded-2xl flex items-center justify-center shadow-lg ${shadowClass} group-hover:scale-110 transition-transform duration-300`}>
            <i className={`${app.icon} text-white text-xl`}></i>
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="ml-5 flex-1 min-w-0">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors duration-200 leading-tight mb-2">
              {app.name}
            </h3>
            <Badge 
              variant="secondary" 
              className={`${bgClass} ${textClass} border ${borderClass} font-semibold text-xs px-3 py-1 rounded-full hover:scale-105 transition-transform duration-200`}
            >
              {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
            </Badge>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <RichTextViewer 
            content={app.description} 
            maxLines={3} 
            className="text-gray-600 leading-relaxed"
          />
        </div>
        
        {/* File attachments indicator */}
        {app.attachments && app.attachments.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="font-medium">
                {app.attachments.length} attachment{app.attachments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {app.subcategory}
          </span>
          <div className="flex items-center space-x-2 text-primary group-hover:text-accent transition-colors">
            <span className="text-sm font-semibold">Launch</span>
            <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
