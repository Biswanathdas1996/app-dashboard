import { ExternalLink, FileText, Eye, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AppDetailsModal } from "./app-details-modal";
import { QRCodeModal } from "./qr-code-modal";
import { StarRating } from "./star-rating";
import { useUpdateApp } from "@/hooks/use-apps";
import { useTrackView, createTrackingData } from "@/hooks/use-analytics";

interface AppCardProps {
  app: WebApp;
  onClick?: (app: WebApp) => void;
}

const categoryColors: Record<string, { gradient: string; bg: string; text: string }> = {
  productivity: { gradient: "from-orange-500 to-orange-600", bg: "bg-orange-50", text: "text-orange-700" },
  development: { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700" },
  marketing: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-700" },
  finance: { gradient: "from-amber-500 to-amber-600", bg: "bg-amber-50", text: "text-amber-700" },
  design: { gradient: "from-rose-500 to-rose-600", bg: "bg-rose-50", text: "text-rose-700" },
  analytics: { gradient: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-700" },
};

export function AppCard({ app, onClick }: AppCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const updateApp = useUpdateApp();
  const trackView = useTrackView();

  useEffect(() => {
    if (!hasTrackedView) {
      const trackingData = createTrackingData(app.id, app.name, app.category, "card_view");
      trackView.mutate(trackingData);
      setHasTrackedView(true);
    }
  }, [app.id, app.name, app.category, hasTrackedView, trackView]);

  const colors = categoryColors[app.category as keyof typeof categoryColors] || 
    { gradient: "from-gray-500 to-gray-600", bg: "bg-gray-50", text: "text-gray-700" };
  
  const handleClick = () => {
    const trackingData = createTrackingData(app.id, app.name, app.category, "launch");
    trackView.mutate(trackingData);
    if (onClick) {
      onClick(app);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    const trackingData = createTrackingData(app.id, app.name, app.category, "detail_view");
    trackView.mutate(trackingData);
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
    <>
      <div 
        className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
        onClick={handleClick}
      >
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm rounded-lg"
          >
            <Eye className="h-3.5 w-3.5 text-gray-500" />
          </Button>
          <Button
            onClick={handleShowQR}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm rounded-lg"
            title="Show QR Code"
          >
            <QrCode className="h-3.5 w-3.5 text-gray-500" />
          </Button>
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start gap-3.5 mb-4">
            <div className={`w-11 h-11 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-sm shrink-0`}>
              <i className={`${app.icon} text-white text-sm`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {app.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`text-[11px] font-medium ${colors.text} ${colors.bg} px-2 py-0.5 rounded-full`}>
                  {app.category}
                </span>
                {app.subcategory && (
                  <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    {app.subcategory}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
            <StarRating
              rating={app.rating || 0}
              onRatingChange={handleRatingChange}
              size="sm"
            />
            <span className="text-xs text-gray-400 font-medium">
              {app.rating ? app.rating.toFixed(1) : '0.0'}
            </span>
          </div>
          
          <div className="flex-1 space-y-2.5">
            {(app.shortDescription || app.description) && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
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
            
            {app.attachments && app.attachments.length > 0 && (
              <div className="flex items-center gap-2 py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="text-xs font-medium text-blue-600">
                  {app.attachments.length} {app.attachments.length === 1 ? 'file' : 'files'} attached
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4">
            <Button
              className={`w-full bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90 transition-all rounded-xl font-semibold py-2.5 text-sm shadow-sm hover:shadow-md border-0`}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              Launch App
            </Button>
          </div>
        </div>
      </div>

      <AppDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        app={app}
      />

      <QRCodeModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={app.url}
        appName={app.name}
      />
    </>
  );
}
