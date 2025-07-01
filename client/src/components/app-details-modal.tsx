import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
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
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-hidden p-0 gap-0">
        {/* Header Section with Gradient Background */}
        <div className={`relative bg-gradient-to-br ${gradientClasses} p-8 text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <DialogHeader className="space-y-0">
              <DialogDescription className="sr-only">
                View detailed information about {app.name} including description, documents, and launch link.
              </DialogDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl border border-white/20">
                    <i className={`${app.icon} text-white text-3xl`}></i>
                  </div>
                  <div>
                    <DialogTitle className="text-4xl font-bold text-white mb-3 tracking-tight">
                      {app.name}
                    </DialogTitle>
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/20 text-white border-white/20 font-semibold text-sm px-4 py-2 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium text-white/90 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                        {app.subcategory}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(app.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Launch Application
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClose();
                    }}
                    className="h-10 w-10 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    title="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Short Description */}
            {app.shortDescription && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Summary</h3>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">
                    {app.shortDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Description</h3>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                <RichTextViewer 
                  content={app.description} 
                  className="text-gray-700 leading-relaxed text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Application Link */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Application Access</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Application URL</p>
                      <p className="text-gray-900 font-mono text-sm truncate bg-gray-50 px-3 py-2 rounded-lg border">
                        {app.url}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">Click below to launch the application in a new tab</p>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(app.url, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Launch Application
                    </Button>
                  </div>
                </div>
              </div>

              {/* Attached Documents */}
              {app.attachments && app.attachments.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Documents ({app.attachments.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {app.attachments.map((filename, index) => {
                      const originalName = getFileDisplayName(filename);
                      return (
                        <div 
                          key={index} 
                          className="group bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md hover:border-gray-300/50 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                                {getFileIcon(filename)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                                  {originalName}
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                  {filename.split('.').pop()} file
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`/api/files/${filename}`, '_blank');
                              }}
                              className="opacity-70 group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-200/50 bg-gray-50/30">
            <div className="flex justify-end">
              <Button 
                type="button"
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="px-8 py-3 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}