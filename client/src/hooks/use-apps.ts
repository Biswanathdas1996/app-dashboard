import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  const url = `/app-dashboard/api/apps${queryString ? `?${queryString}` : ""}`;

  return useQuery<WebApp[]>({
    queryKey: ["/app-dashboard/api/apps", search, category, subcategory],
  });
}

export function useApp(id: number) {
  return useQuery<WebApp>({
    queryKey: ["/app-dashboard/api/apps", id],
    enabled: !!id,
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (app: InsertWebApp) => {
      const response = await apiRequest("POST", "/app-dashboard/api/apps", app);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/app-dashboard/api/apps"] });
      queryClient.invalidateQueries({
        queryKey: ["/app-dashboard/api/categories"],
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
        `/app-dashboard/api/apps/${id}`,
        app
      );
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/app-dashboard/api/apps"] });
      queryClient.invalidateQueries({
        queryKey: ["/app-dashboard/api/apps", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["/app-dashboard/api/categories"],
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
        `/app-dashboard/api/apps/${id}`
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/app-dashboard/api/apps"] });
      queryClient.invalidateQueries({
        queryKey: ["/app-dashboard/api/categories"],
      });
    },
  });
}

export function useCategories() {
  return useQuery<{ categories: string[]; subcategories: string[] }>({
    queryKey: ["/app-dashboard/api/categories"],
  });
}
