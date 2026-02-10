import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, FileText, X, Star, Calendar, Copy, Check, Globe, Paperclip, ArrowUpRight, Layers, Link2, Presentation, Loader2, ChevronLeft, ChevronRight, Download, ArrowLeft, ImageIcon } from "lucide-react";
import type { WebApp } from "@shared/schema";
import { RichTextViewer } from "./rich-text-viewer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AppDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: WebApp;
}

interface SlideData {
  title: string;
  subtitle?: string;
  bullets: string[];
  notes?: string;
  imageKeyword?: string;
  imageBase64?: string;
  imageFormat?: string;
}

const SLIDE_COLORS = [
  { bg: "#191919", accent: "#E8611A", text: "#FFFFFF", accentHex: "E8611A" },
  { bg: "#FFFFFF", accent: "#E8611A", text: "#2D2D2D", accentHex: "E8611A" },
  { bg: "#F7F7F7", accent: "#D93954", text: "#2D2D2D", accentHex: "D93954" },
  { bg: "#FFFFFF", accent: "#E8611A", text: "#2D2D2D", accentHex: "E8611A" },
  { bg: "#1A1A2E", accent: "#E8611A", text: "#FFFFFF", accentHex: "E8611A" },
  { bg: "#E8611A", accent: "#FFFFFF", text: "#FFFFFF", accentHex: "FFFFFF" },
];

async function fetchSlideContent(app: WebApp): Promise<SlideData[]> {
  const plainDescription = app.description
    ? app.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    : app.shortDescription || app.name;

  const response = await fetch("/api/generate-ppt-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      appName: app.name,
      description: plainDescription,
      category: app.category,
      subcategory: app.subcategory,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to generate content");
  }

  const { slides } = (await response.json()) as { slides: SlideData[] };
  return slides;
}

async function fetchSlideImage(slide: SlideData, index: number): Promise<{ imageBase64: string; format: string }> {
  const prompt = slide.imageKeyword || slide.title;
  const response = await fetch("/api/generate-slide-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, slideIndex: index, slideTitle: slide.title }),
  });
  if (!response.ok) {
    throw new Error("Failed to load image");
  }
  return await response.json();
}

async function downloadPPT(slides: SlideData[], app: WebApp): Promise<void> {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "ET Labs";
  pptx.company = "PwC";
  pptx.subject = app.name;
  pptx.title = `${app.name} - Presentation`;

  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    const colors = SLIDE_COLORS[index % SLIDE_COLORS.length];

    slide.background = { color: colors.bg.replace("#", "") };

    const hasImage = slideData.imageBase64 && slideData.imageBase64.length > 100;
    const imgFormat = slideData.imageFormat || "jpeg";
    const pptImageData = hasImage ? `data:image/${imgFormat};base64,${slideData.imageBase64}` : null;

    if (index === 0) {
      if (pptImageData) {
        slide.addImage({ data: pptImageData, x: 0, y: 0, w: 13.33, h: 7.5, transparency: 65 });
      }
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { type: "solid", color: "191919" }, transparency: 25 } as any);
      slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.4, w: 0.06, h: 1.6, fill: { type: "solid", color: "E8611A" } });
      slide.addText(slideData.title.toUpperCase(), { x: 1.2, y: 1.4, w: 7, h: 1.6, fontSize: 38, fontFace: "Arial", color: "FFFFFF", bold: true, lineSpacingMultiple: 1.05, charSpacing: 1.5 });
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, { x: 1.2, y: 3.2, w: 7, h: 0.7, fontSize: 18, fontFace: "Arial", color: "E8611A", bold: false });
      }
      const categoryLabel = [app.category, app.subcategory].filter(Boolean).join("  |  ");
      slide.addText(categoryLabel.toUpperCase(), { x: 1.2, y: 4.2, w: 6, h: 0.4, fontSize: 11, fontFace: "Arial", color: "999999", charSpacing: 2 });
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.0, w: 13.33, h: 0.04, fill: { type: "solid", color: "E8611A" } });
      slide.addText("ET Labs  |  PwC", { x: 1.2, y: 6.4, w: 6, h: 0.35, fontSize: 10, fontFace: "Arial", color: "777777", charSpacing: 1 });

      if (pptImageData) {
        slide.addImage({ data: pptImageData, x: 8.6, y: 1.2, w: 4.0, h: 3.0, rounding: true });
        slide.addShape(pptx.ShapeType.rect, { x: 8.6, y: 1.2, w: 4.0, h: 3.0, fill: { type: "solid", color: "000000" }, transparency: 50, rectRadius: 0.12 } as any);
      }
    } else if (index === slides.length - 1) {
      if (pptImageData) {
        slide.addImage({ data: pptImageData, x: 0, y: 0, w: 13.33, h: 7.5, transparency: 80 });
      }
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { type: "solid", color: colors.bg.replace("#", "") }, transparency: 15 } as any);
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.04, fill: { type: "solid", color: "E8611A" } });
      slide.addText(slideData.title.toUpperCase(), { x: 1.0, y: 1.4, w: 7, h: 1.0, fontSize: 32, fontFace: "Arial", color: colors.text.replace("#", ""), bold: true, charSpacing: 1.5 });
      slide.addShape(pptx.ShapeType.rect, { x: 1.0, y: 2.5, w: 2.0, h: 0.04, fill: { type: "solid", color: "E8611A" } });
      if (slideData.bullets && slideData.bullets.length > 0) {
        const bulletText = slideData.bullets.map((b) => ({ text: b, options: { fontSize: 15, color: colors.text.replace("#", ""), paraSpaceAfter: 14, bullet: { type: "bullet" as const, color: colors.accentHex } } }));
        slide.addText(bulletText, { x: 1.0, y: 2.9, w: 7, h: 2.2, fontFace: "Arial", valign: "top", lineSpacingMultiple: 1.2 });
      }
      slide.addText(app.url, { x: 1.0, y: 5.4, w: 6, h: 0.35, fontSize: 11, fontFace: "Arial", color: "E8611A", hyperlink: { url: app.url } });
      slide.addText("ET Labs  |  PwC", { x: 1.0, y: 6.5, w: 6, h: 0.35, fontSize: 10, fontFace: "Arial", color: "777777", charSpacing: 1 });
      slide.addText(`${index + 1} / ${slides.length}`, { x: 11.5, y: 6.8, w: 1.5, h: 0.35, fontSize: 9, fontFace: "Arial", color: "999999", align: "right" });
    } else {
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.1, h: 7.5, fill: { type: "solid", color: colors.accentHex } });

      slide.addText(slideData.title.toUpperCase(), { x: 0.5, y: 0.5, w: 7, h: 0.8, fontSize: 24, fontFace: "Arial", color: colors.text.replace("#", ""), bold: true, charSpacing: 1.5 });
      slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.35, w: 1.8, h: 0.04, fill: { type: "solid", color: colors.accentHex } });

      if (slideData.subtitle) {
        slide.addText(slideData.subtitle.toUpperCase(), { x: 0.5, y: 1.55, w: 7, h: 0.5, fontSize: 11, fontFace: "Arial", color: "999999", charSpacing: 1.5 });
      }

      if (pptImageData) {
        slide.addImage({ data: pptImageData, x: 8.0, y: 0.5, w: 4.8, h: 3.2, rounding: true });
        slide.addShape(pptx.ShapeType.rect, { x: 8.0, y: 0.5, w: 4.8, h: 3.2, fill: { type: "solid", color: colors.bg.replace("#", "") }, transparency: 55, rectRadius: 0.12 } as any);
      }

      if (slideData.bullets && slideData.bullets.length > 0) {
        const startY = slideData.subtitle ? 2.3 : 1.8;
        const contentWidth = pptImageData ? 7.0 : 11;
        const bulletText = slideData.bullets.map((b) => ({ text: b, options: { fontSize: 15, color: colors.text === "#FFFFFF" ? "DDDDDD" : "3D3D3D", paraSpaceAfter: 14, bullet: { type: "bullet" as const, color: colors.accentHex } } }));
        slide.addText(bulletText, { x: 0.5, y: startY, w: contentWidth, h: 3.5, fontFace: "Arial", valign: "top", lineSpacingMultiple: 1.25 });
      }

      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.1, w: 13.33, h: 0.03, fill: { type: "solid", color: colors.accentHex }, transparency: 50 } as any);
      slide.addText(`${index + 1} / ${slides.length}`, { x: 11.5, y: 6.8, w: 1.5, h: 0.35, fontSize: 9, fontFace: "Arial", color: "999999", align: "right" });
    }

    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }
  });

  const safeName = app.name.replace(/[^a-zA-Z0-9]/g, "_");
  await pptx.writeFile({ fileName: `${safeName}_Presentation.pptx` });
}

function SlidePreview({ slide, index, total }: { slide: SlideData; index: number; total: number }) {
  const colors = SLIDE_COLORS[index % SLIDE_COLORS.length];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const hasImage = slide.imageBase64 && slide.imageBase64.length > 100;
  const imgFormat = slide.imageFormat || "jpeg";
  const imgSrc = hasImage ? `data:image/${imgFormat};base64,${slide.imageBase64}` : null;

  if (isFirst) {
    return (
      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative" style={{ backgroundColor: colors.bg }}>
        {imgSrc && (
          <img src={imgSrc} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#191919] via-[#191919]/85 to-[#191919]/40" />
        {imgSrc && (
          <div className="absolute right-[2%] top-[6%] w-[34%] h-[78%] rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        <div className="absolute left-[4%] top-[10%] w-[0.4%] h-[30%] rounded-full" style={{ backgroundColor: colors.accent }} />
        <div className="absolute bottom-0 left-0 w-full h-[0.6%]" style={{ backgroundColor: colors.accent }} />
        <div className="absolute left-[6%] top-[12%] right-[38%]">
          <h2 className="text-white font-extrabold text-base sm:text-xl md:text-2xl leading-tight tracking-wide uppercase">{slide.title}</h2>
          {slide.subtitle && <p className="mt-1.5 text-xs sm:text-sm font-medium" style={{ color: colors.accent }}>{slide.subtitle}</p>}
          {slide.bullets && slide.bullets.length > 0 && (
            <ul className="mt-3 space-y-1">
              {slide.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-snug text-gray-300">
                  <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: colors.accent }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[8px] sm:text-[9px] text-gray-500 tracking-widest uppercase">ET Labs  |  PwC</p>
        </div>
      </div>
    );
  }

  if (isLast) {
    return (
      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative" style={{ backgroundColor: colors.bg }}>
        {imgSrc && (
          <img src={imgSrc} alt="" className="absolute inset-0 w-full h-full object-cover opacity-12" />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.bg}f0, ${colors.bg}d0)` }} />
        <div className="absolute top-0 left-0 w-full h-[0.6%]" style={{ backgroundColor: colors.accent }} />
        <div className="absolute left-[5%] top-[8%] right-[5%] bottom-[8%] flex flex-col">
          <h2 className="font-extrabold text-base sm:text-xl tracking-wide uppercase" style={{ color: colors.text }}>{slide.title}</h2>
          <div className="mt-1.5 w-10 h-0.5" style={{ backgroundColor: colors.accent }} />
          {slide.bullets && slide.bullets.length > 0 && (
            <ul className="mt-2.5 space-y-1.5 flex-1">
              {slide.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] sm:text-xs leading-snug" style={{ color: colors.text }}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colors.accent }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[8px] text-gray-500 tracking-widest uppercase">ET Labs  |  PwC</span>
            <span className="text-[8px] text-gray-400">{index + 1} / {total}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative" style={{ backgroundColor: colors.bg }}>
      <div className="absolute left-0 top-0 w-[0.6%] h-full" style={{ backgroundColor: colors.accent }} />
      {imgSrc && (
        <div className="absolute right-[2%] top-[6%] w-[28%] h-[78%] rounded-lg overflow-hidden shadow-xl border border-black/5">
          <img src={imgSrc} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.bg}40, transparent)` }} />
        </div>
      )}
      <div className="absolute left-[3%] top-[6%] bottom-[8%] flex flex-col" style={{ width: imgSrc ? "62%" : "92%" }}>
        <h2 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: colors.text }}>{slide.title}</h2>
        <div className="mt-1 w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }} />
        {slide.subtitle && <p className="mt-1 text-[9px] tracking-wider text-gray-400 uppercase">{slide.subtitle}</p>}
        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="mt-2 space-y-1 flex-1">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-snug" style={{ color: colors.text === "#FFFFFF" ? "#DDDDDD" : "#3D3D3D" }}>
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colors.accent }} />
                {b}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto text-[8px] text-gray-400">{index + 1} / {total}</div>
      </div>
    </div>
  );
}

export function AppDetailsModal({ isOpen, onClose, app }: AppDetailsModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<SlideData[] | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadingCount, setImageLoadingCount] = useState(0);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleGeneratePPT = async () => {
    setIsGeneratingPPT(true);
    try {
      const slides = await fetchSlideContent(app);
      setGeneratedSlides(slides);
      setCurrentSlide(0);

      setImageLoadingCount(slides.length);
      const imagePromises = slides.map(async (slide, idx) => {
        try {
          const imgResult = await fetchSlideImage(slide, idx);
          return { index: idx, ...imgResult };
        } catch {
          return { index: idx, imageBase64: "", format: "" };
        }
      });

      const imageResults = await Promise.allSettled(imagePromises);
      setGeneratedSlides(prev => {
        if (!prev) return prev;
        const updated = [...prev];
        imageResults.forEach(result => {
          if (result.status === "fulfilled" && result.value.imageBase64) {
            const { index, imageBase64, format } = result.value;
            updated[index] = { ...updated[index], imageBase64, imageFormat: format };
          }
        });
        return updated;
      });
      setImageLoadingCount(0);
    } catch (error: any) {
      console.error("PPT generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate the presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  const handleDownloadPPT = async () => {
    if (!generatedSlides) return;
    setIsDownloading(true);
    try {
      await downloadPPT(generatedSlides, app);
      toast({ title: "Downloaded", description: "Your PowerPoint file has been saved." });
    } catch (error: any) {
      toast({ title: "Download Failed", description: error.message || "Could not download the file.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBackToDetails = () => {
    setGeneratedSlides(null);
    setCurrentSlide(0);
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

  if (generatedSlides) {
    const currentSlideHasImage = generatedSlides[currentSlide]?.imageBase64 && generatedSlides[currentSlide].imageBase64!.length > 100;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] overflow-hidden p-0 gap-0 flex flex-col rounded-3xl border border-gray-200/60 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] bg-gray-950">
          <DialogHeader className="sr-only">
            <DialogTitle>Presentation Preview - {app.name}</DialogTitle>
            <DialogDescription>Preview your generated presentation slides</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBackToDetails(); }}
                className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="h-4 w-px bg-white/10" />
              <h3 className="text-sm font-semibold text-white/80">{app.name}</h3>
              {imageLoadingCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-orange-400/80">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Generating images...</span>
                </div>
              )}
              {imageLoadingCount === 0 && generatedSlides.some(s => s.imageBase64) && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400/70">
                  <ImageIcon className="h-3 w-3" />
                  <span>Images ready</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadPPT(); }}
                disabled={isDownloading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs h-8 px-4 rounded-lg shadow-sm transition-all gap-1.5"
              >
                {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                {isDownloading ? "Saving..." : "Download PPT"}
              </Button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); setGeneratedSlides(null); setCurrentSlide(0); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0 overflow-hidden">
            <div className="w-full max-w-3xl relative">
              <SlidePreview
                slide={generatedSlides[currentSlide]}
                index={currentSlide}
                total={generatedSlides.length}
              />
              {imageLoadingCount > 0 && !currentSlideHasImage && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 text-orange-400 animate-spin" />
                  <span className="text-[10px] text-white/60">Loading image...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-5">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide(Math.max(0, currentSlide - 1)); }}
                disabled={currentSlide === 0}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {generatedSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide(i); }}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? "w-6 bg-orange-500" : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide(Math.min(generatedSlides.length - 1, currentSlide + 1)); }}
                disabled={currentSlide === generatedSlides.length - 1}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <p className="text-[11px] text-white/30 mt-3">
              Slide {currentSlide + 1} of {generatedSlides.length}
            </p>
          </div>

          <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {generatedSlides.map((s, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide(i); }}
                  className={`shrink-0 w-24 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentSlide
                      ? "border-orange-500 shadow-lg shadow-orange-500/20"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <div className="w-full h-full p-1.5 flex flex-col justify-center relative" style={{ backgroundColor: SLIDE_COLORS[i % SLIDE_COLORS.length].bg }}>
                    {s.imageBase64 && s.imageBase64.length > 100 && (
                      <div className="absolute inset-0 opacity-30">
                        <img
                          src={s.imageFormat?.includes("svg") ? `data:image/svg+xml;base64,${s.imageBase64}` : `data:image/${s.imageFormat || "png"};base64,${s.imageBase64}`}
                          alt="" className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {i === 0 && <div className="w-1 h-3 rounded-full mb-1 relative z-10" style={{ backgroundColor: SLIDE_COLORS[0].accent }} />}
                    <p className="text-[6px] font-bold truncate leading-tight relative z-10" style={{ color: SLIDE_COLORS[i % SLIDE_COLORS.length].text }}>{s.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently added'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleGeneratePPT(); }}
                disabled={isGeneratingPPT}
                className="text-sm h-9 px-5 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-all font-semibold gap-2"
              >
                {isGeneratingPPT ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Presentation className="h-3.5 w-3.5" />
                    Generate PPT
                  </>
                )}
              </Button>
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
