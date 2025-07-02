import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertWebAppSchema, type WebApp, type InsertWebApp, type Category } from "@shared/schema";
import { useCreateApp, useUpdateApp } from "@/hooks/use-apps";
import { useCategories } from "@/hooks/use-categories";
import { RichTextEditor } from "./rich-text-editor";
import { FileUpload } from "./file-upload";
import { StarRating } from "./star-rating";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  app?: WebApp;
}

const iconOptions = [
  { value: "fas fa-project-diagram", label: "Project Diagram" },
  { value: "fas fa-code", label: "Code" },
  { value: "fas fa-chart-line", label: "Chart Line" },
  { value: "fas fa-dollar-sign", label: "Dollar Sign" },
  { value: "fas fa-tasks", label: "Tasks" },
  { value: "fas fa-database", label: "Database" },
  { value: "fas fa-globe", label: "Globe" },
  { value: "fas fa-cog", label: "Settings" },
  { value: "fas fa-rocket", label: "Rocket" },
  { value: "fas fa-palette", label: "Palette" },
];

// Remove hard-coded categories - now using dynamic categories from API

export function AppModal({ isOpen, onClose, app }: AppModalProps) {
  const { toast } = useToast();
  const createApp = useCreateApp();
  const updateApp = useUpdateApp();
  const { data: categoriesData } = useCategories();
  
  const form = useForm<InsertWebApp>({
    resolver: zodResolver(insertWebAppSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      url: "",
      category: "",
      subcategory: "",
      icon: "fas fa-globe",
      isActive: true,
      attachments: [],
      rating: 1,
    },
  });

  useEffect(() => {
    if (app) {
      form.reset({
        name: app.name,
        shortDescription: app.shortDescription || "",
        description: app.description,
        url: app.url,
        category: app.category,
        subcategory: app.subcategory,
        icon: app.icon,
        isActive: app.isActive,
        attachments: app.attachments || [],
        rating: app.rating || 1,
      });
    } else {
      form.reset({
        name: "",
        shortDescription: "",
        description: "",
        url: "",
        category: "",
        subcategory: "",
        icon: "fas fa-globe",
        isActive: true,
        attachments: [],
        rating: 1,
      });
    }
  }, [app, form]);

  const onSubmit = async (data: InsertWebApp) => {
    try {
      console.log("Submitting app data:", data);
      if (app) {
        await updateApp.mutateAsync({ id: app.id, app: data });
        toast({
          title: "Success",
          description: "App updated successfully",
        });
      } else {
        await createApp.mutateAsync(data);
        toast({
          title: "Success", 
          description: "App created successfully",
        });
      }
      onClose();
    } catch (error) {
      console.error("App submission error:", error);
      toast({
        title: "Error",
        description: app ? "Failed to update app" : "Failed to create app",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-header">{app ? "Edit App" : "Add New App"}</DialogTitle>
          <DialogDescription>
            {app ? "Update the application information below." : "Fill in the details below to add a new application to the directory."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter app name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Brief summary of the application (e.g., 'A tool for project management')" 
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesData?.map((category: Category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subcategory" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={(value: string) => field.onChange(value)}
                      placeholder="Describe the application and its features..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center">
                            <i className={`${icon.value} mr-2`}></i>
                            {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Rating</FormLabel>
                  <FormControl>
                    <div className="py-2">
                      <StarRating
                        rating={field.value || 1}
                        onRatingChange={field.onChange}
                        size="md"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents & Files</FormLabel>
                  <FormControl>
                    <FileUpload
                      files={field.value || []}
                      onChange={field.onChange}
                      maxFiles={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createApp.isPending || updateApp.isPending}
                onClick={() => {
                  console.log("Form validation errors:", form.formState.errors);
                  console.log("Form values:", form.getValues());
                }}
              >
                {createApp.isPending || updateApp.isPending 
                  ? (app ? "Updating..." : "Creating...") 
                  : (app ? "Update App" : "Create App")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
