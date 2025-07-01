import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category, Subcategory, InsertCategory, UpdateCategory, InsertSubcategory, UpdateSubcategory } from "@shared/schema";

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => apiRequest("/api/categories") as Promise<Category[]>,
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (category: InsertCategory) => {
      return apiRequest("/api/categories", {
        method: "POST",
        body: JSON.stringify(category),
        headers: { "Content-Type": "application/json" },
      }) as Promise<Category>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: async ({ id, category }: { id: number; category: UpdateCategory }) => {
      return apiRequest(`/api/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(category),
        headers: { "Content-Type": "application/json" },
      }) as Promise<Category>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/categories/${id}`, {
        method: "DELETE",
      });
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
    queryFn: () => {
      const url = categoryId 
        ? `/api/subcategories?categoryId=${categoryId}`
        : "/api/subcategories";
      return apiRequest(url) as Promise<Subcategory[]>;
    },
  });
}

export function useCreateSubcategory() {
  return useMutation({
    mutationFn: async (subcategory: InsertSubcategory) => {
      return apiRequest("/api/subcategories", {
        method: "POST",
        body: JSON.stringify(subcategory),
        headers: { "Content-Type": "application/json" },
      }) as Promise<Subcategory>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
    },
  });
}

export function useUpdateSubcategory() {
  return useMutation({
    mutationFn: async ({ id, subcategory }: { id: number; subcategory: UpdateSubcategory }) => {
      return apiRequest(`/api/subcategories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(subcategory),
        headers: { "Content-Type": "application/json" },
      }) as Promise<Subcategory>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
    },
  });
}

export function useDeleteSubcategory() {
  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/subcategories/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
    },
  });
}