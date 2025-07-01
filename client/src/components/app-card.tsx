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
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors duration-200 leading-tight mb-1 line-clamp-1">
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
          <RichTextViewer 
            content={app.description} 
            maxLines={2} 
            className="text-gray-600 text-sm leading-relaxed"
          />
        </div>
        
        {/* Compact footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium text-gray-500 bg-gray-50/80 px-2 py-1 rounded-md">
              {app.subcategory}
            </span>
            {app.attachments && app.attachments.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <FileText className="h-3 w-3" />
                <span>{app.attachments.length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 text-primary group-hover:text-accent transition-colors">
            <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">Open</span>
            <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
