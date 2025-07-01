import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ProjectRequisition, InsertProjectRequisition, UpdateProjectRequisition } from "@shared/schema";

export function useRequisitions() {
  return useQuery({
    queryKey: ["/api/requisitions"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/requisitions");
      return response.json() as Promise<ProjectRequisition[]>;
    },
  });
}

export function useRequisition(id: number) {
  return useQuery({
    queryKey: ["/api/requisitions", id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/requisitions/${id}`);
      return response.json() as Promise<ProjectRequisition>;
    },
    enabled: !!id,
  });
}

export function useCreateRequisition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requisition: InsertProjectRequisition) => {
      const response = await apiRequest("POST", "/api/requisitions", requisition);
      return response.json() as Promise<ProjectRequisition>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requisitions"] });
    },
  });
}

export function useUpdateRequisition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, requisition }: { id: number; requisition: UpdateProjectRequisition }) => {
      const response = await apiRequest("PATCH", `/api/requisitions/${id}`, requisition);
      return response.json() as Promise<ProjectRequisition>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requisitions"] });
    },
  });
}

export function useDeleteRequisition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/requisitions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requisitions"] });
    },
  });
}