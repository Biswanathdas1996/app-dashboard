import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, FileText, Eye, X, Star, Calendar, Copy, Check } from "lucide-react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
import { StarRating } from "./star-rating";
import { useState } from "react";

interface AppDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: WebApp;
}

export function AppDetailsModal({ isOpen, onClose, app }: AppDetailsModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
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
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'txt':
      case 'rtf':
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  const getFileTypeColor = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'from-red-50 to-red-100 border-red-200';
      case 'doc':
      case 'docx':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'txt':
      case 'rtf':
        return 'from-gray-50 to-gray-100 border-gray-200';
      default:
        return 'from-blue-50 to-blue-100 border-blue-200';
    }
  };

  const formatFileSize = (filename: string) => {
    // This is a placeholder - in a real app you'd get actual file sizes
    return `${Math.floor(Math.random() * 500) + 50} KB`;
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
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-hidden p-0 gap-0 flex flex-col">
        {/* Header Section with Gradient Background */}
        <div className={`relative bg-gradient-to-br ${gradientClasses} p-6 text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative z-10">
            <DialogHeader className="space-y-0">
              <DialogDescription className="text-white/80 text-sm mb-3">
                View detailed information about {app.name}
              </DialogDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                    <i className={`${app.icon} text-white text-2xl`}></i>
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold text-white mb-2 tracking-tight font-header">
                      {app.name}
                    </DialogTitle>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/20 text-white border-white/20 font-semibold text-xs px-3 py-1 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                      </Badge>
                      {app.subcategory && (
                        <span className="text-xs font-medium text-white/90 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                          {app.subcategory}
                        </span>
                      )}
                      <div className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-white">
                          {app.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(app.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Launch
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
                    className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Close modal"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-8 space-y-8">
            {/* Short Description */}
            {app.shortDescription && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900 font-header">Summary</h3>
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
                <h3 className="text-2xl font-bold text-gray-900 font-header">Description</h3>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                <RichTextViewer 
                  content={app.description || ""} 
                  className="text-gray-700 leading-relaxed text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Application Link */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900 font-header">Application Access</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Application URL</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg border font-mono text-sm text-gray-900 min-w-0">
                          <span className="truncate block">{app.url}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            copyToClipboard(app.url);
                          }}
                          className="shrink-0 h-9 w-9 p-0 hover:bg-blue-50 hover:border-blue-300"
                          title="Copy URL"
                        >
                          {copiedUrl ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-3">Click below to launch the application in a new tab</p>
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(app.url, '_blank', 'noopener,noreferrer');
                        }}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                        size="lg"
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Launch Application
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attached Documents */}
              {app.attachments && app.attachments.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900 font-header">
                      Documents ({app.attachments.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {app.attachments.map((filename, index) => {
                      const originalName = getFileDisplayName(filename);
                      const fileTypeColor = getFileTypeColor(filename);
                      return (
                        <div 
                          key={index} 
                          className="group bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md hover:border-gray-300/50 transition-all duration-200 hover:scale-[1.01]"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-14 h-14 bg-gradient-to-br ${fileTypeColor} rounded-xl flex items-center justify-center border`}>
                                {getFileIcon(filename)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                                  {originalName}
                                </p>
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                    {filename.split('.').pop()} file
                                  </span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">
                                    {formatFileSize(filename)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
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
                                <Eye className="h-4 w-4 mr-1" />
                                Open
                              </Button>
                            </div>
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
          <div className="p-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-xs text-gray-500">
                  Press <kbd className="px-2 py-1 bg-white border rounded text-gray-600 font-mono">Esc</kbd> to close
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently added'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(app.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Launch
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="px-6 py-2 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}