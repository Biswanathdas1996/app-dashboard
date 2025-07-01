import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import type { WebApp, InsertWebApp, UpdateWebApp } from "@shared/schema";

export function useApps(
  search?: string,
  category?: string,
  subcategory?: string
) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (subcategory) params.append("subcategory", subcategory);

  const queryString = params.toString();
  const url = `/api/apps${queryString ? `?${queryString}` : ""}`;

  return useQuery<WebApp[]>({
    queryKey: [url],
  });
}

export function useApp(id: number) {
  return useQuery<WebApp>({
    queryKey: [`/api/apps/${id}`],
    enabled: !!id,
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (app: InsertWebApp) => {
      const response = await apiRequest("POST", "/api/apps", app);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/categories"],
      });
    },
  });
}

export function useUpdateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, app }: { id: number; app: UpdateWebApp }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/apps/${id}`,
        app
      );
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/apps", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/categories"],
      });
    },
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(
        "DELETE",
        `/api/apps/${id}`
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/categories"],
      });
    },
  });
}

export function useCategories() {
  return useQuery<{ categories: string[]; subcategories: string[] }>({
    queryKey: ["/api/categories"],
  });
}
