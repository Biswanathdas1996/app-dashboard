import { ExternalLink, FileText, Eye, QrCode } from "lucide-react";
import { useState } from "react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AppDetailsModal } from "./app-details-modal";
import { QRCodeModal } from "./qr-code-modal";
import { StarRating } from "./star-rating";
import { useUpdateApp } from "@/hooks/use-apps";

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
  const [showQRModal, setShowQRModal] = useState(false);
  const updateApp = useUpdateApp();
  
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

  const handleShowQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQRModal(true);
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      await updateApp.mutateAsync({
        id: app.id,
        app: { rating: newRating }
      });
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  return (
    <div 
      className="group relative bg-white/98 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden w-full flex flex-col h-full transform hover:scale-[1.02]"
      onClick={handleClick}
    >
      {/* Enhanced glassmorphism effect with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white/40 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 p-[1px]">
        <div className="w-full h-full bg-white rounded-3xl"></div>
      </div>
      
      {/* Modern floating action button with improved positioning */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="h-8 w-8 p-0 bg-white/98 backdrop-blur-md border border-gray-200/60 hover:bg-primary/5 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all rounded-xl hover:scale-110"
        >
          <Eye className="h-3.5 w-3.5 text-gray-600 group-hover:text-primary" />
        </Button>
      </div>
      
      <div className="relative p-5 flex flex-col flex-1 z-10">
        {/* Enhanced header with optimized spacing */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${gradientClasses} rounded-2xl flex items-center justify-center shadow-xl ${shadowClass} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20 relative overflow-hidden`}>
            {/* Icon shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <i className={`${app.icon} text-white text-lg relative z-10`}></i>
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
              {app.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded-full">
                {app.category}
              </span>
              {app.subcategory && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                  {app.subcategory}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <StarRating
                rating={app.rating || 0}
                onRatingChange={handleRatingChange}
                size="sm"
              />
              <span className="text-xs text-gray-500 font-medium">
                {app.rating ? app.rating.toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Optimized description section */}
        <div className="flex-1 space-y-3">
          {(app.shortDescription || app.description) && (
            <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 rounded-xl p-3 border border-gray-200/40">
              {app.shortDescription ? (
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                  {app.shortDescription}
                </p>
              ) : (
                <RichTextViewer 
                  content={app.description || ""} 
                  maxLines={4} 
                  className="text-gray-700 text-sm leading-relaxed"
                />
              )}
            </div>
          )}
          
          {/* Compact file indicator */}
          {app.attachments && app.attachments.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 rounded-xl border border-blue-200/60 group-hover:border-blue-300/80 transition-colors duration-300">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 flex-1">
                {app.attachments.length} {app.attachments.length === 1 ? 'file' : 'files'}
              </span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Optimized action buttons */}
        <div className="mt-auto pt-3">
          <div className="flex gap-2.5 items-stretch">
            <Button
              className={`flex-1 bg-gradient-to-r ${gradientClasses} text-white hover:opacity-95 hover:scale-[1.02] transition-all duration-400 shadow-lg ${shadowClass} rounded-xl font-bold py-3.5 text-sm border-0 group-hover:shadow-xl relative overflow-hidden`}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <ExternalLink className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">Launch App</span>
            </Button>
            <Button
              onClick={handleShowQR}
              variant="outline"
              className="w-14 h-auto rounded-xl border-2 border-gray-300 hover:border-primary hover:bg-primary/10 transition-all duration-400 shadow-md hover:shadow-lg flex items-center justify-center hover:scale-105 group/qr relative overflow-hidden"
              title="Show QR Code"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover/qr:opacity-100 transition-opacity duration-400"></div>
              <QrCode className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover/qr:rotate-12" />
            </Button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AppDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        app={app}
      />

      {/* QR Code Modal */}
      <QRCodeModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={app.url}
        appName={app.name}
      />
    </div>
  );
}
