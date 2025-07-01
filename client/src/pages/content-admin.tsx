import { useState } from "react";
import { Plus, Edit, Trash2, Settings, FileText, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContentModal } from "@/components/content-modal";
import { RichTextViewer } from "@/components/rich-text-viewer";

// Mock data for now - will be replaced with API calls
const mockSiteContent = [
  {
    id: 1,
    section: "hero",
    title: "We unite expertise and tech so you can outthink, outpace and outperform",
    subtitle: "Transform your business with our integrated approach",
    content: "<p>Transform your business with our integrated approach combining deep industry knowledge with cutting-edge technology solutions.</p>",
    buttonText: "View Applications",
    buttonUrl: "/dashboard",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    section: "metrics",
    title: "Catalysing value creation in Indian global capability centres",
    subtitle: "11-12% CAGR growth expected",
    content: "<p>PwC India's latest research reveals that value creation can be comprehensively faster when global capability centres (GCCs) are fully unleashed for bold new opportunities.</p>",
    buttonText: "Click here to explore more",
    buttonUrl: "#",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockNavigationItems = [
  { id: 1, label: "Applications", url: "/dashboard", order: 1, isActive: true, createdAt: new Date() },
  { id: 2, label: "Industries", url: "#", order: 2, isActive: true, createdAt: new Date() },
  { id: 3, label: "Services", url: "#", order: 3, isActive: true, createdAt: new Date() },
  { id: 4, label: "Research and Insights", url: "#", order: 4, isActive: true, createdAt: new Date() },
  { id: 5, label: "About us", url: "#", order: 5, isActive: true, createdAt: new Date() },
  { id: 6, label: "Careers", url: "#", order: 6, isActive: true, createdAt: new Date() },
];

export default function ContentAdmin() {
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  const handleEditContent = (content: any) => {
    setEditingContent(content);
    setIsContentModalOpen(true);
  };

  const handleSaveContent = async (contentData: any) => {
    // TODO: Implement API call
    console.log("Saving content:", contentData);
    setIsContentModalOpen(false);
    setEditingContent(null);
  };

  const handleModalClose = () => {
    setIsContentModalOpen(false);
    setEditingContent(null);
  };

  return (
    <div className="min-h-screen bg-pwc-light flex flex-col">
      <Header />
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pwc-orange to-pwc-dark text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-charter">
                  Content Management
                </h1>
                <p className="text-xl opacity-90 text-helvetica">
                  Manage website content, navigation, and page sections
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Mode
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="content" className="text-helvetica">
                <FileText className="mr-2 h-4 w-4" />
                Site Content
              </TabsTrigger>
              <TabsTrigger value="navigation" className="text-helvetica">
                <Navigation className="mr-2 h-4 w-4" />
                Navigation
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-helvetica">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Site Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-charter text-pwc-dark">Site Content Sections</h2>
                  <p className="text-helvetica text-pwc-dark/70">Manage content for different sections of your website</p>
                </div>
                <Button
                  onClick={() => setIsContentModalOpen(true)}
                  className="bg-pwc-orange hover:bg-pwc-orange/90 text-white text-helvetica font-semibold"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content Section
                </Button>
              </div>

              <div className="grid gap-6">
                {mockSiteContent.map((content) => (
                  <Card key={content.id} className="pwc-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs font-mono bg-pwc-light text-pwc-dark border-pwc-orange">
                              {content.section}
                            </Badge>
                            <Badge className={content.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {content.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl text-charter text-pwc-dark">{content.title}</CardTitle>
                          {content.subtitle && (
                            <CardDescription className="text-helvetica text-pwc-dark/70 mt-1">
                              {content.subtitle}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContent(content)}
                            className="text-pwc-orange hover:bg-pwc-orange/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {content.content && (
                        <div>
                          <h4 className="font-semibold text-helvetica text-pwc-dark mb-2">Content Preview:</h4>
                          <RichTextViewer content={content.content} maxLines={3} />
                        </div>
                      )}
                      
                      {(content.buttonText || content.buttonUrl) && (
                        <div className="flex gap-4 text-sm">
                          {content.buttonText && (
                            <div>
                              <span className="font-semibold text-helvetica text-pwc-dark">Button: </span>
                              <span className="text-helvetica text-pwc-dark/70">{content.buttonText}</span>
                            </div>
                          )}
                          {content.buttonUrl && (
                            <div>
                              <span className="font-semibold text-helvetica text-pwc-dark">URL: </span>
                              <span className="text-helvetica text-pwc-dark/70">{content.buttonUrl}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-helvetica text-pwc-dark/50">
                        Order: {content.order} | Last updated: {content.updatedAt.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Navigation Tab */}
            <TabsContent value="navigation" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-charter text-pwc-dark">Navigation Menu</h2>
                  <p className="text-helvetica text-pwc-dark/70">Manage navigation menu items and their order</p>
                </div>
                <Button className="bg-pwc-orange hover:bg-pwc-orange/90 text-white text-helvetica font-semibold">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Navigation Item
                </Button>
              </div>

              <Card className="pwc-shadow">
                <CardHeader>
                  <CardTitle className="text-charter text-pwc-dark">Navigation Items</CardTitle>
                  <CardDescription className="text-helvetica text-pwc-dark/70">
                    Drag and drop to reorder navigation items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockNavigationItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-pwc-light rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-pwc-orange/10 rounded-md flex items-center justify-center text-xs font-bold text-pwc-orange">
                            {item.order}
                          </div>
                          <div>
                            <div className="font-semibold text-helvetica text-pwc-dark">{item.label}</div>
                            <div className="text-xs text-helvetica text-pwc-dark/60">{item.url}</div>
                          </div>
                          <Badge className={item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-pwc-orange hover:bg-pwc-orange/10">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-charter text-pwc-dark">Global Settings</h2>
                <p className="text-helvetica text-pwc-dark/70">Configure global website settings and preferences</p>
              </div>

              <Card className="pwc-shadow">
                <CardHeader>
                  <CardTitle className="text-charter text-pwc-dark">Site Configuration</CardTitle>
                  <CardDescription className="text-helvetica text-pwc-dark/70">
                    General settings for your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-helvetica text-pwc-dark/70">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />

      <ContentModal
        isOpen={isContentModalOpen}
        onClose={handleModalClose}
        content={editingContent}
        onSave={handleSaveContent}
      />
    </div>
  );
}