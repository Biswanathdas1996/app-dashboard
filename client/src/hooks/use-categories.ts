import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category, Subcategory, InsertCategory, UpdateCategory, InsertSubcategory, UpdateSubcategory } from "@shared/schema";

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/categories");
      return response.json() as Promise<Category[]>;
    },
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (category: InsertCategory) => {
      const response = await apiRequest("POST", "/api/categories", category);
      return response.json() as Promise<Category>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: async ({ id, category }: { id: number; category: UpdateCategory }) => {
      const response = await apiRequest("PATCH", `/api/categories/${id}`, category);
      return response.json() as Promise<Category>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

// Subcategories
export function useSubcategories(categoryId?: number) {
  return useQuery({
    queryKey: ["/api/subcategories", categoryId],
    queryFn: async () => {
      const url = categoryId 
        ? `/api/subcategories?categoryId=${categoryId}`
        : "/api/subcategories";
      const response = await apiRequest("GET", url);
      return response.json() as Promise<Subcategory[]>;
    },
  });
}

export function useCreateSubcategory() {
  return useMutation({
    mutationFn: async (subcategory: InsertSubcategory) => {
      const response = await apiRequest("POST", "/api/subcategories", subcategory);
      return response.json() as Promise<Subcategory>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
    },
  });
}

export function useUpdateSubcategory() {
  return useMutation({
    mutationFn: async ({ id, subcategory }: { id: number; subcategory: UpdateSubcategory }) => {
      const response = await apiRequest("PATCH", `/api/subcategories/${id}`, subcategory);
      return response.json() as Promise<Subcategory>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
    },
  });
}

export function useDeleteSubcategory() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/subcategories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
    },
  });
}