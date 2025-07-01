import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AppModal } from "@/components/app-modal";
import { CategoryManagement } from "@/components/category-management";
import { useApps, useDeleteApp } from "@/hooks/use-apps";
import { useToast } from "@/hooks/use-toast";
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

export default function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<WebApp | undefined>();
  const { toast } = useToast();

  const { data: apps, isLoading } = useApps();
  const deleteApp = useDeleteApp();

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
            <div className="hidden sm:block">
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
                  <p className="text-gray-600 mt-1">Manage your web application directory</p>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
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
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
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
                  apps.map((app) => {
                    const colorClass = categoryColors[app.category as keyof typeof categoryColors] || "bg-slate-100 text-slate-700";
                    
                    return (
                      <TableRow key={app.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                              <i className={`${app.icon} text-white text-sm`}></i>
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{app.name}</div>
                              <div className="text-sm text-slate-500">{app.subcategory}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={colorClass}>
                            {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a 
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 text-sm hover:text-blue-600 flex items-center"
                          >
                            {app.url}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge className={app.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                            {app.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(app)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{app.name}"? This action cannot be undone and will permanently remove the application from your directory.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(app)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deleteApp.isPending}
                                  >
                                    {deleteApp.isPending ? "Deleting..." : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                      <div className="text-slate-500">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">No applications yet</h3>
                        <p className="mb-4">Get started by adding your first web application</p>
                        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First App
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategoryManagement />
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
