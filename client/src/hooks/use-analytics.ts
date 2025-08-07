import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InsertAnalytics } from "@shared/schema";

interface AnalyticsSummary {
  totalViews: number;
  mostViewedApps: Array<{
    appId: number;
    appName: string;
    appCategory: string;
    viewCount: number;
  }>;
  viewsByCategory: Array<{
    category: string;
    viewCount: number;
  }>;
  recentViews: Array<{
    id: number;
    appId: number | null;
    appName: string;
    appCategory: string;
    viewType: string;
    userAgent: string | null;
    sessionId: string | null;
    ipAddress: string | null;
    createdAt: string;
  }>;
}

export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary"],
  });
}

export function useTrackView() {
  return useMutation({
    mutationFn: async (analytics: InsertAnalytics) => {
      return await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analytics),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      // Invalidate analytics summary to get updated data
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
    },
  });
}

// Utility function to generate a session ID
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

// Utility function to track application views
export function createTrackingData(
  appId: number,
  appName: string,
  appCategory: string,
  viewType: "card_view" | "detail_view" | "launch"
): InsertAnalytics {
  return {
    appId,
    appName,
    appCategory,
    viewType,
    userAgent: navigator.userAgent,
    sessionId: getSessionId(),
    ipAddress: null, // Will be set on the server side if needed
  };
}