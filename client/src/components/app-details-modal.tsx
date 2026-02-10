import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, FileText, Eye, X, Star, Calendar, Copy, Check, Globe, Paperclip, ArrowUpRight } from "lucide-react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
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
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden p-0 gap-0 flex flex-col rounded-2xl border-0 shadow-2xl bg-white">

        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all z-10"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader className="space-y-0">
            <DialogDescription className="sr-only">
              Details for {app.name}
            </DialogDescription>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                <i className={`${app.icon} text-white text-xl`}></i>
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <DialogTitle className="text-xl font-extrabold text-gray-900 tracking-tight font-header leading-tight mb-1.5">
                  {app.name}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-gray-100 text-gray-600 border-0 font-medium text-[11px] px-2.5 py-0.5 rounded-md hover:bg-gray-100">
                    {app.category}
                  </Badge>
                  {app.subcategory && (
                    <Badge variant="outline" className="text-gray-500 border-gray-200 font-medium text-[11px] px-2.5 py-0.5 rounded-md">
                      {app.subcategory}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-600">{app.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-6 py-5 space-y-5">

            {app.shortDescription && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {app.shortDescription}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">About</h3>
              <div className="bg-white rounded-xl">
                <RichTextViewer 
                  content={app.description || ""} 
                  className="text-sm text-gray-600 leading-relaxed"
                  maxLines={0}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Application URL</h3>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 font-mono truncate flex-1">{app.url}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard(app.url); }}
                  className="shrink-0 h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg"
                >
                  {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            {app.attachments && app.attachments.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  <Paperclip className="h-3 w-3 inline mr-1" />
                  Attachments ({app.attachments.length})
                </h3>
                <div className="space-y-2">
                  {app.attachments.map((filename, index) => {
                    const originalName = getFileDisplayName(filename);
                    return (
                      <div 
                        key={index} 
                        className="group flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 border border-gray-100 transition-colors cursor-pointer"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`/api/files/${filename}`, '_blank'); }}
                      >
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
                          {getFileIcon(filename)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{originalName}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{filename.split('.').pop()} file</p>
                        </div>
                        <Eye className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently added'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm h-9 px-4 rounded-lg"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(app.url, '_blank', 'noopener,noreferrer'); }}
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm h-9 px-5 rounded-lg shadow-sm hover:shadow-md transition-all group"
              >
                Launch App
                <ArrowUpRight className="h-3.5 w-3.5 ml-1.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
