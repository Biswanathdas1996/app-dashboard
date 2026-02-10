import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, FileText, Eye, X, Star, Calendar, Copy, Check, Globe, Paperclip, ArrowUpRight, Layers, Link2 } from "lucide-react";
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
      <DialogContent className="max-w-4xl w-[95vw] max-h-[92vh] overflow-hidden p-0 gap-0 flex flex-col rounded-3xl border border-gray-200/60 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] bg-white">

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 rounded-t-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)] rounded-t-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.1),transparent_60%)] rounded-t-3xl" />

          <div className="relative px-8 pt-7 pb-6">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all backdrop-blur-sm z-10"
            >
              <X className="h-4 w-4" />
            </button>

            <DialogHeader className="space-y-0">
              <DialogDescription className="sr-only">
                Details for {app.name}
              </DialogDescription>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-xl shrink-0">
                  <i className={`${app.icon} text-white text-2xl`}></i>
                </div>
                <div className="min-w-0 flex-1 pr-10">
                  <DialogTitle className="text-2xl font-extrabold text-white tracking-tight font-header leading-tight mb-2">
                    {app.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge className="bg-white/15 text-white/90 border-0 font-medium text-[11px] px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <Layers className="h-3 w-3 mr-1 opacity-70" />
                      {app.category}
                    </Badge>
                    {app.subcategory && (
                      <Badge className="bg-white/10 text-white/70 border border-white/10 font-medium text-[11px] px-3 py-1 rounded-full hover:bg-white/15 transition-colors">
                        {app.subcategory}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-1 backdrop-blur-sm">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-bold text-white/90">{app.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-8 py-6 space-y-6">

            {app.shortDescription && (
              <div className="relative bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-orange-50/30 rounded-2xl p-5 border border-indigo-100/60">
                <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
                  {app.shortDescription}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">About</h3>
              </div>
              <div className="pl-3">
                <RichTextViewer 
                  content={app.description || ""} 
                  className="text-[15px] text-gray-600 leading-relaxed"
                  maxLines={0}
                />
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100/80">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-4 w-4 text-gray-400" />
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Application URL</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-200/60 shadow-sm min-w-0">
                  <Globe className="h-4 w-4 text-gray-300 shrink-0" />
                  <span className="text-sm text-gray-700 font-mono truncate">{app.url}</span>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard(app.url); }}
                  className="shrink-0 h-10 w-10 rounded-xl bg-white border border-gray-200/60 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
                >
                  {copiedUrl ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(app.url, '_blank', 'noopener,noreferrer'); }}
                  className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm h-10 px-5 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  Open
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>

            {app.attachments && app.attachments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">
                    Attachments
                  </h3>
                  <span className="text-[11px] text-gray-400 font-medium bg-gray-100 rounded-full px-2 py-0.5">
                    {app.attachments.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {app.attachments.map((filename, index) => {
                    const originalName = getFileDisplayName(filename);
                    return (
                      <div 
                        key={index} 
                        className="group flex items-center gap-3 bg-white hover:bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-gray-200 transition-all cursor-pointer shadow-sm hover:shadow"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`/api/files/${filename}`, '_blank'); }}
                      >
                        <div className="w-9 h-9 bg-gray-50 group-hover:bg-white rounded-lg flex items-center justify-center border border-gray-200/60 shrink-0 transition-colors">
                          {getFileIcon(filename)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{originalName}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{filename.split('.').pop()}</p>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently added'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm h-9 px-5 rounded-xl"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(app.url, '_blank', 'noopener,noreferrer'); }}
                className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold text-sm h-9 px-6 rounded-xl shadow-md hover:shadow-lg transition-all group"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                Launch App
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
