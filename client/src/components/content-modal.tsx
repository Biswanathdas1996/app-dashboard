import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RichTextEditor } from "./rich-text-editor";
import type { SiteContent, InsertSiteContent, UpdateSiteContent } from "@shared/schema";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: SiteContent;
  onSave: (content: InsertSiteContent | UpdateSiteContent) => Promise<void>;
}

export function ContentModal({ isOpen, onClose, content, onSave }: ContentModalProps) {
  const [formData, setFormData] = useState<InsertSiteContent>({
    section: "",
    title: "",
    subtitle: "",
    content: "",
    buttonText: "",
    buttonUrl: "",
    isActive: true,
    order: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        section: content.section,
        title: content.title,
        subtitle: content.subtitle || "",
        content: content.content || "",
        buttonText: content.buttonText || "",
        buttonUrl: content.buttonUrl || "",
        isActive: content.isActive,
        order: content.order,
      });
    } else {
      setFormData({
        section: "",
        title: "",
        subtitle: "",
        content: "",
        buttonText: "",
        buttonUrl: "",
        isActive: true,
        order: 0,
      });
    }
  }, [content, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof InsertSiteContent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-charter text-pwc-dark">
            {content ? "Edit Content Section" : "Create Content Section"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="section" className="text-helvetica font-semibold text-pwc-dark">
                Section ID <span className="text-pwc-orange">*</span>
              </Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => handleInputChange("section", e.target.value)}
                placeholder="e.g., hero, about, services"
                required
                disabled={!!content} // Don't allow editing section ID for existing content
                className="text-helvetica"
              />
              <p className="text-xs text-gray-500 text-helvetica">Unique identifier for this content section</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order" className="text-helvetica font-semibold text-pwc-dark">
                Display Order
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                min="0"
                className="text-helvetica"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-helvetica font-semibold text-pwc-dark">
              Title <span className="text-pwc-orange">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Section title"
              required
              className="text-helvetica"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-helvetica font-semibold text-pwc-dark">
              Subtitle
            </Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              placeholder="Optional subtitle"
              className="text-helvetica"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-helvetica font-semibold text-pwc-dark">
              Content
            </Label>
            <RichTextEditor
              content={formData.content || ""}
              onChange={(content) => handleInputChange("content", content)}
              placeholder="Enter the main content for this section..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buttonText" className="text-helvetica font-semibold text-pwc-dark">
                Button Text
              </Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => handleInputChange("buttonText", e.target.value)}
                placeholder="e.g., Learn More, Get Started"
                className="text-helvetica"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonUrl" className="text-helvetica font-semibold text-pwc-dark">
                Button URL
              </Label>
              <Input
                id="buttonUrl"
                value={formData.buttonUrl}
                onChange={(e) => handleInputChange("buttonUrl", e.target.value)}
                placeholder="e.g., /about, https://example.com"
                className="text-helvetica"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive" className="text-helvetica font-semibold text-pwc-dark">
              Active (visible on website)
            </Label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="text-helvetica border-pwc-orange text-pwc-orange hover:bg-pwc-orange hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-pwc-orange hover:bg-pwc-orange/90 text-white text-helvetica font-semibold"
            >
              {isLoading ? "Saving..." : content ? "Update Content" : "Create Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}