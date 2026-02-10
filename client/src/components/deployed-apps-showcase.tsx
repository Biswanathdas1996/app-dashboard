import { useQuery } from "@tanstack/react-query";
import { ExternalLink, User, DollarSign, BarChart3, Shield, Zap, Database, Globe, Briefcase, Settings, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { useTrackView, createTrackingData } from "@/hooks/use-analytics";
import { useEffect, useState } from "react";

interface ProjectRequisition {
  id: number;
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  priority: string;
  category: string;
  expectedDelivery: string;
  attachments: string[];
  logo: string;
  status: string;
  deployedLink: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DeployedAppsShowcaseProps {
  searchValue?: string;
  categoryFilter?: string;
  subcategoryFilter?: string;
}

export function DeployedAppsShowcase({ 
  searchValue = "", 
  categoryFilter = "", 
  subcategoryFilter = "" 
}: DeployedAppsShowcaseProps) {
  const { data: requisitions = [], isLoading } = useQuery<ProjectRequisition[]>({
    queryKey: ["/api/requisitions"],
  });
  const trackView = useTrackView();
  const [trackedViews, setTrackedViews] = useState<Set<number>>(new Set());

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    switch (categoryLower) {
      case 'financial':
      case 'finance':
        return { icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'analytics':
      case 'data':
        return { icon: BarChart3, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'security':
      case 'cybersecurity':
        return { icon: Shield, gradient: 'from-red-500 to-red-600', bg: 'bg-red-50', text: 'text-red-700' };
      case 'technology':
      case 'tech':
        return { icon: Zap, gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-700' };
      case 'database':
      case 'storage':
        return { icon: Database, gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' };
      case 'web':
      case 'website':
        return { icon: Globe, gradient: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' };
      case 'business':
      case 'enterprise':
        return { icon: Briefcase, gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', text: 'text-gray-700' };
      case 'operations':
      case 'management':
        return { icon: Settings, gradient: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', text: 'text-teal-700' };
      default:
        return { icon: ExternalLink, gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', text: 'text-orange-700' };
    }
  };

  const allProjects = requisitions.filter((project) => {
    if (searchValue && searchValue.trim() !== "") {
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.requesterName.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    if (categoryFilter && categoryFilter.trim() !== "") {
      const projectCategory = project.category.toLowerCase();
      const filterCategory = categoryFilter.toLowerCase();
      if (projectCategory !== filterCategory) return false;
    }
    return true;
  });

  useEffect(() => {
    if (allProjects.length > 0) {
      allProjects.forEach(project => {
        if (!trackedViews.has(project.id)) {
          const trackingData = createTrackingData(
            project.id, 
            project.title, 
            project.category, 
            "card_view"
          );
          trackView.mutate(trackingData);
          setTrackedViews(prev => new Set(prev).add(project.id));
        }
      });
    }
  }, [allProjects, trackedViews, trackView]);

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-100 rounded-lg w-64 mx-auto"></div>
              <div className="h-4 bg-gray-50 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (allProjects.length === 0) {
    return null;
  }

  return (
    <section className="bg-white border-t border-gray-100 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-header mb-3">
            Project Portfolio
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            Innovative digital solutions developed by PwC's ET Labs team across various stages of development and deployment.
          </p>
          {(searchValue || categoryFilter) && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              <span>Filtered</span>
              {searchValue && <span className="text-gray-400">|</span>}
              {searchValue && <span>"{searchValue}"</span>}
              {categoryFilter && <span className="text-gray-400">|</span>}
              {categoryFilter && <span>{categoryFilter}</span>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allProjects.map((app) => {
            const categoryInfo = getCategoryIcon(app.category);
            const IconComponent = categoryInfo.icon;
            const hasDeployedLink = app.deployedLink && app.deployedLink.trim() !== '';
            return (
              <div 
                key={app.id}
                className={`group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full ${hasDeployedLink ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={hasDeployedLink ? () => {
                  const launchTrackingData = createTrackingData(app.id, app.title, app.category, "launch");
                  trackView.mutate(launchTrackingData);
                  window.open(app.deployedLink, '_blank', 'noopener,noreferrer');
                } : undefined}
              >
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className={`w-11 h-11 bg-gradient-to-br ${categoryInfo.gradient} rounded-xl flex items-center justify-center shadow-sm shrink-0`}>
                      <IconComponent className="text-white h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {app.title}
                      </h3>
                      <span className={`inline-block mt-1.5 text-[11px] font-medium ${categoryInfo.text} ${categoryInfo.bg} px-2 py-0.5 rounded-full`}>
                        {app.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-700 block truncate">
                          {app.requesterName}
                        </span>
                        <span className="text-xs text-gray-400 block truncate">
                          {app.requesterEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {hasDeployedLink ? (
                    <div className="mt-auto pt-4">
                      <Button
                        className={`w-full bg-gradient-to-r ${categoryInfo.gradient} text-white hover:opacity-90 transition-all rounded-xl font-semibold py-2.5 text-sm shadow-sm hover:shadow-md border-0`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const launchTrackingData = createTrackingData(app.id, app.title, app.category, "launch");
                          trackView.mutate(launchTrackingData);
                          window.open(app.deployedLink, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-2" />
                        Launch Application
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-auto pt-4">
                      <div className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-400 rounded-xl font-medium py-2.5 text-sm border border-gray-100">
                        <Clock className="h-3.5 w-3.5" />
                        In Development
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {(searchValue || categoryFilter) ? (
              <>Showing {allProjects.length} of {requisitions.length} project{allProjects.length !== 1 ? 's' : ''}</>
            ) : (
              <>{allProjects.length} project{allProjects.length !== 1 ? 's' : ''} by PwC ET Labs</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
