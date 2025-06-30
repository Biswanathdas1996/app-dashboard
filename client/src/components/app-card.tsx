import { ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import type { WebApp } from "@shared/schema";

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
  const [showPreview, setShowPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  
  const colorClasses = categoryColors[app.category as keyof typeof categoryColors] || 
    "from-slate-500 to-slate-600 bg-slate-100 text-slate-700";
  
  const [gradientClasses, badgeClasses] = colorClasses.split(' bg-');
  
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger navigation if clicking on preview button
    if ((e.target as HTMLElement).closest('.preview-button')) {
      return;
    }
    
    if (onClick) {
      onClick(app);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(!showPreview);
  };

  const handleIframeError = () => {
    setPreviewError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group">
      {/* Preview Section */}
      {showPreview && (
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
              <span>Preview of {app.name}</span>
              <button 
                className="text-slate-400 hover:text-slate-600"
                onClick={handlePreviewClick}
              >
                ✕
              </button>
            </div>
            {!previewError ? (
              <div className="relative h-32 bg-slate-50 rounded-lg overflow-hidden">
                <iframe
                  src={app.url}
                  className="w-full h-full border-0 transform scale-50 origin-top-left"
                  style={{ width: '200%', height: '200%' }}
                  onError={handleIframeError}
                  title={`Preview of ${app.name}`}
                  sandbox="allow-same-origin"
                />
              </div>
            ) : (
              <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <div className="text-2xl mb-2">🚫</div>
                  <div className="text-xs">Preview not available</div>
                  <div className="text-xs">Click to visit site</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-6 cursor-pointer" onClick={handleClick}>
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
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {app.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {app.subcategory}
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="preview-button p-1 text-slate-400 hover:text-blue-600 transition-colors"
              onClick={handlePreviewClick}
              title="Toggle preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
