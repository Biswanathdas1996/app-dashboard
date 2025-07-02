import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { X, Download, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  appName: string;
}

export function QRCodeModal({ isOpen, onClose, url, appName }: QRCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode();
    }
  }, [isOpen, url]);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `${appName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`;
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90vw] max-h-[85vh] overflow-hidden p-0 gap-0 flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black border-gray-700">
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white border-b border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10">
            <DialogHeader className="space-y-0">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold text-white tracking-tight">
                    QR Code
                  </DialogTitle>
                  <DialogDescription className="text-gray-300 text-xs">
                    Scan to access {appName}
                  </DialogDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Close modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4 bg-gradient-to-br from-gray-900 to-black">
            {/* Larger QR Code Container */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-600 mx-auto w-fit">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt={`QR Code for ${appName}`}
                  className="w-64 h-64 mx-auto"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                </div>
              )}
            </div>

            {/* Compact URL Display */}
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">URL</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-900/50 px-2 py-1 rounded border border-gray-600 font-mono text-xs text-gray-200 min-w-0">
                  <span className="truncate block">{url}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard();
                  }}
                  className="shrink-0 h-7 w-7 p-0 hover:bg-blue-600/20 border-gray-600 text-gray-300 hover:text-white"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Compact Instructions */}
            <div className="text-center space-y-1">
              <p className="text-gray-300 text-xs">
                Point your camera at the QR code
              </p>
              <p className="text-gray-500 text-xs">
                Works with most smartphones
              </p>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="p-3 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              <kbd className="px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-gray-300 font-mono text-xs">Esc</kbd>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  downloadQRCode();
                }}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 px-3 py-1 rounded text-xs"
                disabled={!qrCodeUrl}
              >
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button 
                type="button"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded text-xs"
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