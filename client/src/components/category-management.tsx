import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertCategorySchema, insertSubcategorySchema, type InsertCategory, type InsertSubcategory, type Category, type Subcategory } from "@shared/schema";
import { useCategories, useCreateCategory, useDeleteCategory, useSubcategories, useCreateSubcategory, useDeleteSubcategory } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface CategoryFormProps {
  onSuccess: () => void;
}

function CategoryForm({ onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const createCategory = useCreateCategory();
  
  const form = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: InsertCategory) => {
    try {
      await createCategory.mutateAsync(data);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createCategory.isPending}>
          {createCategory.isPending ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </Form>
  );
}

interface SubcategoryFormProps {
  categories: Category[];
  onSuccess: () => void;
}

function SubcategoryForm({ categories, onSuccess }: SubcategoryFormProps) {
  const { toast } = useToast();
  const createSubcategory = useCreateSubcategory();
  
  const form = useForm<InsertSubcategory>({
    resolver: zodResolver(insertSubcategorySchema),
    defaultValues: {
      name: "",
      categoryId: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data: InsertSubcategory) => {
    try {
      await createSubcategory.mutateAsync(data);
      toast({
        title: "Success",
        description: "Subcategory created successfully",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subcategory",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter subcategory name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createSubcategory.isPending}>
          {createSubcategory.isPending ? "Creating..." : "Create Subcategory"}
        </Button>
      </form>
    </Form>
  );
}

export function CategoryManagement() {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubcategories();
  const deleteCategory = useDeleteCategory();
  const deleteSubcategory = useDeleteSubcategory();
  const { toast } = useToast();

  const handleDeleteCategory = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      try {
        await deleteCategory.mutateAsync(id);
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteSubcategory = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the subcategory "${name}"?`)) {
      try {
        await deleteSubcategory.mutateAsync(id);
        toast({
          title: "Success",
          description: "Subcategory deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete subcategory",
          variant: "destructive",
        });
      }
    }
  };

  if (categoriesLoading || subcategoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold font-header">Category Management</h2>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium font-header">Categories</h3>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new category to organize your applications.
                  </DialogDescription>
                </DialogHeader>
                <CategoryForm onSuccess={() => setCategoryDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-header">{category.name}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      disabled={deleteCategory.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subcategories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium font-header">Subcategories</h3>
            <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subcategory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Subcategory</DialogTitle>
                  <DialogDescription>
                    Add a new subcategory under an existing category.
                  </DialogDescription>
                </DialogHeader>
                <SubcategoryForm 
                  categories={categories} 
                  onSuccess={() => setSubcategoryDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {subcategories.map((subcategory) => {
              const category = categories.find(c => c.id === subcategory.categoryId);
              return (
                <Card key={subcategory.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base font-header">{subcategory.name}</CardTitle>
                        <CardDescription className="font-body">
                          Category: {category?.name || 'Unknown'}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteSubcategory(subcategory.id, subcategory.name)}
                        disabled={deleteSubcategory.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}