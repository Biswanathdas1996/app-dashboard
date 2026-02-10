import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Eye, TrendingUp, Activity, Clock } from "lucide-react";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { format } from "date-fns";

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-gray-100">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity className="h-6 w-6 text-gray-300" />
        </div>
        <p className="text-gray-400 text-sm">No analytics data available</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Views", value: analytics.totalViews.toLocaleString(), sub: "All-time views", icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Popular Apps", value: analytics.mostViewedApps.length, sub: "With views", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Categories", value: analytics.viewsByCategory.length, sub: "Active", icon: BarChart3, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Recent Activity", value: analytics.recentViews.length, sub: "Events", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-2xl border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                  <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="rounded-2xl border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2 font-header">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Most Viewed Applications
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Top performing by total views
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.mostViewedApps.slice(0, 8).map((app, index) => (
                <div key={`viewed-${app.appId}-${index}`} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 truncate max-w-48">
                        {app.appName}
                      </p>
                      <span className="text-[11px] text-gray-400 font-medium">{app.appCategory}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{app.viewCount}</span>
                    <span className="text-xs text-gray-400 ml-1">views</span>
                  </div>
                </div>
              ))}
              {analytics.mostViewedApps.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No views recorded yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2 font-header">
              <BarChart3 className="h-4 w-4 text-violet-600" />
              Views by Category
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.viewsByCategory.map((category) => {
                const maxViews = Math.max(...analytics.viewsByCategory.map(c => c.viewCount));
                const percentage = maxViews > 0 ? (category.viewCount / maxViews) * 100 : 0;
                
                return (
                  <div key={`cat-${category.category}`} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {category.category}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {category.viewCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {analytics.viewsByCategory.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No category data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2 font-header">
            <Clock className="h-4 w-4 text-orange-600" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Latest view events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {analytics.recentViews.slice(0, 10).map((view) => (
              <div key={view.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {view.appName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {view.appCategory} &middot; {view.viewType.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {format(new Date(view.createdAt), 'MMM dd, HH:mm')}
                </span>
              </div>
            ))}
            {analytics.recentViews.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
