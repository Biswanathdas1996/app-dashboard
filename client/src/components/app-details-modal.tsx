import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, FileText, Eye, X } from "lucide-react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";

interface AppDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: WebApp;
}

export function AppDetailsModal({ isOpen, onClose, app }: AppDetailsModalProps) {
  const categoryColors = {
    productivity: "from-primary to-accent shadow-primary/20 bg-primary/10 text-primary border-primary/20",
    development: "from-emerald-500 to-emerald-600 shadow-emerald-500/20 bg-emerald-50 text-emerald-700 border-emerald-200",
    marketing: "from-purple-500 to-purple-600 shadow-purple-500/20 bg-purple-50 text-purple-700 border-purple-200",
    finance: "from-amber-500 to-amber-600 shadow-amber-500/20 bg-amber-50 text-amber-700 border-amber-200",
    design: "from-rose-500 to-rose-600 shadow-rose-500/20 bg-rose-50 text-rose-700 border-rose-200",
    analytics: "from-indigo-500 to-indigo-600 shadow-indigo-500/20 bg-indigo-50 text-indigo-700 border-indigo-200",
  } as const;

  const colorClasses = categoryColors[app.category as keyof typeof categoryColors] || 
    "from-slate-500 to-slate-600 shadow-slate-500/20 bg-slate-50 text-slate-700 border-slate-200";
  
  const colorParts = colorClasses.split(' ');
  const gradientClasses = colorParts.slice(0, 2).join(' ');
  const shadowClass = colorParts[2];
  const bgClass = colorParts[3];
  const textClass = colorParts[4];
  const borderClass = colorParts[5];

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'txt':
      case 'rtf':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getFileDisplayName = (filename: string) => {
    const parts = filename.split('-');
    if (parts.length > 1 && /^\d+$/.test(parts[0])) {
      return parts.slice(1).join('-');
    }
    return filename;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${gradientClasses} rounded-2xl flex items-center justify-center shadow-lg ${shadowClass}`}>
                <i className={`${app.icon} text-white text-2xl`}></i>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {app.name}
                </DialogTitle>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="secondary" 
                    className={`${bgClass} ${textClass} border ${borderClass} font-semibold text-sm px-3 py-1 rounded-lg`}
                  >
                    {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                  </Badge>
                  <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                    {app.subcategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
              <RichTextViewer 
                content={app.description} 
                className="text-gray-700 leading-relaxed"
              />
            </div>
          </div>

          {/* Application Link */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Link</h3>
            <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 mb-1">URL</p>
                  <p className="text-gray-700 font-mono text-sm truncate">{app.url}</p>
                </div>
                <Button
                  onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
                  className="ml-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Launch App
                </Button>
              </div>
            </div>
          </div>

          {/* Attached Documents */}
          {app.attachments && app.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Attached Documents ({app.attachments.length})
              </h3>
              <div className="space-y-3">
                {app.attachments.map((filename, index) => {
                  const originalName = getFileDisplayName(filename);
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-150"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(filename)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {filename.split('.').pop()?.toUpperCase()} file
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/api/files/${filename}`, '_blank')}
                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}