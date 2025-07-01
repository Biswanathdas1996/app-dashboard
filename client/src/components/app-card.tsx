import { ExternalLink, FileText } from "lucide-react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
import { Badge } from "./ui/badge";

interface AppCardProps {
  app: WebApp;
  onClick?: (app: WebApp) => void;
}

const categoryColors = {
  productivity: "from-blue-500 to-blue-600 bg-blue-100 text-blue-700",
  development: "from-emerald-500 to-emerald-600 bg-emerald-100 text-emerald-700",
  marketing: "from-purple-500 to-purple-600 bg-purple-100 text-purple-700",
  finance: "from-amber-500 to-amber-600 bg-amber-100 text-amber-700",
  design: "from-rose-500 to-rose-600 bg-rose-100 text-rose-700",
  analytics: "from-indigo-500 to-indigo-600 bg-indigo-100 text-indigo-700",
} as const;

export function AppCard({ app, onClick }: AppCardProps) {
  const colorClasses = categoryColors[app.category as keyof typeof categoryColors] || 
    "from-slate-500 to-slate-600 bg-slate-100 text-slate-700";
  
  const [gradientClasses, badgeClasses] = colorClasses.split(' bg-');
  
  const handleClick = () => {
    if (onClick) {
      onClick(app);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradientClasses} rounded-lg flex items-center justify-center`}>
            <i className={`${app.icon} text-white text-lg`}></i>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {app.name}
            </h3>
            <span className={`text-xs bg-${badgeClasses} px-2 py-1 rounded-full`}>
              {app.category}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <RichTextViewer content={app.description} maxLines={3} />
        </div>
        
        {app.attachments && app.attachments.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <FileText className="h-3 w-3" />
              <span>{app.attachments.length} file{app.attachments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {app.subcategory}
          </span>
          <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}
