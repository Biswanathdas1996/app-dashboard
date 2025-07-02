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
      className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/60 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/40 hover:-translate-y-2 transition-all duration-400 cursor-pointer overflow-hidden min-w-[280px] flex flex-col h-full"
      onClick={handleClick}
    >
      {/* Enhanced glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-white/60 to-accent/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
      
      {/* Modern floating action button */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-2 group-hover:translate-y-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="h-9 w-9 p-0 bg-white/95 backdrop-blur-md border border-gray-200/80 hover:bg-white shadow-xl hover:shadow-2xl transition-all rounded-2xl hover:scale-110"
        >
          <Eye className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
      
      <div className="relative p-6 flex flex-col flex-1">
        {/* Modern header with larger icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${gradientClasses} rounded-2xl flex items-center justify-center shadow-2xl ${shadowClass} group-hover:scale-110 group-hover:rotate-6 transition-all duration-400 border border-white/30`}>
            <i className={`${app.icon} text-white text-xl`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-2 mb-2">
              {app.name}
            </h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {app.category}
            </p>
            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
              <StarRating
                rating={app.rating || 0}
                onRatingChange={handleRatingChange}
                size="sm"
              />
            </div>
          </div>
        </div>
        
        {/* Enhanced description */}
        <div className="flex-1">
          {(app.shortDescription || app.description) && (
            <div className="mb-5">
              {app.shortDescription ? (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {app.shortDescription}
                </p>
              ) : (
                <RichTextViewer 
                  content={app.description || ""} 
                  maxLines={3} 
                  className="text-gray-600 text-sm leading-relaxed"
                />
              )}
            </div>
          )}
          
          {/* Enhanced file indicator */}
          {app.attachments && app.attachments.length > 0 && (
            <div className="flex items-center gap-2 mb-5 p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{app.attachments.length} files</span>
            </div>
          )}
        </div>

        {/* Modern action buttons - Always at bottom */}
        <div className="mt-auto space-y-3">
          <div className="flex gap-2">
            <Button
              className={`flex-1 bg-gradient-to-r ${gradientClasses} text-white hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-xl ${shadowClass} rounded-2xl font-bold py-4 text-base border-0 group-hover:shadow-2xl`}
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Launch Application
            </Button>
            <Button
              onClick={handleShowQR}
              variant="outline"
              className="px-4 py-4 rounded-2xl border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Show QR Code"
            >
              <QrCode className="h-5 w-5" />
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
