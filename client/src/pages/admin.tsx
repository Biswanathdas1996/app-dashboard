import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus, Edit, Trash2, ExternalLink, Download, Upload, LogOut, BarChart3, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AppModal } from "@/components/app-modal";
import { CategoryManagement } from "@/components/category-management";
import { RequisitionManagement } from "@/components/requisition-management";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { useApps, useDeleteApp } from "@/hooks/use-apps";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import type { WebApp } from "@shared/schema";

const categoryColors = {
  productivity: "bg-blue-100 text-blue-700",
  development: "bg-emerald-100 text-emerald-700", 
  marketing: "bg-purple-100 text-purple-700",
  finance: "bg-amber-100 text-amber-700",
  design: "bg-rose-100 text-rose-700",
  analytics: "bg-indigo-100 text-indigo-700",
} as const;

// Sortable Table Row Component
function SortableTableRow({ app, onEdit, onDelete }: { app: WebApp; onEdit: (app: WebApp) => void; onDelete: (app: WebApp) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const categoryColor = categoryColors[app.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700";

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? "shadow-lg" : ""}>
      <TableCell className="w-8">
        <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{app.name}</TableCell>
      <TableCell>
        <Badge variant="secondary" className={categoryColor}>
          {app.category}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{app.subcategory}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={app.isActive ? "default" : "secondary"}>
          {app.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(app)}>
            <Edit className="w-4 h-4" />
          </Button>
          {app.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{app.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(app)} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<WebApp | undefined>();
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setLocation("/admin-login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const { data: apps, isLoading } = useApps();
  const deleteApp = useDeleteApp();

  // Add sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mutation for reordering apps
  const reorderMutation = useMutation({
    mutationFn: async (reorderedIds: number[]) => {
      const response = await fetch('/api/apps/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reorderedIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder apps');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch apps
      queryClient.invalidateQueries({ queryKey: ['/api/apps'] });
      toast({
        title: "Success",
        description: "Applications reordered successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reorder applications",
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !apps) return;

    if (active.id !== over.id) {
      const oldIndex = apps.findIndex((app) => app.id === active.id);
      const newIndex = apps.findIndex((app) => app.id === over.id);

      const newOrder = arrayMove(apps, oldIndex, newIndex);
      const reorderedIds = newOrder.map(app => app.id);
      
      reorderMutation.mutate(reorderedIds);
    }
  };

  const handleEdit = (app: WebApp) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleDelete = async (app: WebApp) => {
    try {
      await deleteApp.mutateAsync(app.id);
      toast({
        title: "Success",
        description: `${app.name} has been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete app",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingApp(undefined);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apps-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Data exported to CSV successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(importData),
      });

      if (!response.ok) throw new Error('Import failed');
      
      const result = await response.json();
      
      toast({
        title: "Success",
        description: `Import completed: ${result.imported.apps} apps, ${result.imported.categories} categories, ${result.imported.subcategories} subcategories`,
      });
      
      // Refresh the page data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-header">
                Admin Panel
              </h1>
              <p className="text-xl opacity-90 font-body">
                Manage your web applications directory
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="lg"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New App
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="requisitions">Project Requests</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
                  <p className="text-gray-600 mt-1">Manage your web application directory</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2">
                    <Button 
                      onClick={handleExport}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button 
                      onClick={handleImportClick}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:bg-gray-50"
                      disabled={isImporting}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isImporting ? "Importing..." : "Import Data"}
                    </Button>
                  </div>
                  <div className="sm:hidden">
                    <Button 
                      onClick={() => setIsModalOpen(true)} 
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add App
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Mobile export/import buttons */}
              <div className="sm:hidden flex gap-2 mb-4">
                <Button 
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button 
                  onClick={handleImportClick}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                  disabled={isImporting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isImporting ? "Importing..." : "Import"}
                </Button>
              </div>

              {/* Hidden file input for import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>App Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subcategory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="w-8">
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Skeleton className="w-8 h-8 rounded-lg mr-3" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-8 h-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : apps && apps.length > 0 ? (
                    <SortableContext items={apps.map(app => app.id)} strategy={verticalListSortingStrategy}>
                      {apps.map((app) => (
                        <SortableTableRow
                          key={app.id}
                          app={app}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-slate-500">
                          <p className="text-lg font-medium">No applications found</p>
                          <p className="text-sm">Create your first application to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="requisitions" className="space-y-6">
              <RequisitionManagement />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                  <p className="text-gray-600 mt-1">Track application usage and performance metrics</p>
                </div>
              </div>
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AppModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        app={editingApp}
      />
    </div>
  );
}
