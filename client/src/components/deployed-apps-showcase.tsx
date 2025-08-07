import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Calendar, User, DollarSign, BarChart3, Shield, Zap, Database, Globe, Briefcase, Settings } from "lucide-react";
import { Button } from "./ui/button";

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

export function DeployedAppsShowcase() {
  const { data: requisitions = [], isLoading } = useQuery<ProjectRequisition[]>({
    queryKey: ["/api/requisitions"],
  });

  // Function to get category-specific icon and colors
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    switch (categoryLower) {
      case 'financial':
      case 'finance':
        return { 
          icon: DollarSign, 
          bgGradient: 'from-green-300 to-green-400',
          shadowColor: 'shadow-green-300/20'
        };
      case 'analytics':
      case 'data':
        return { 
          icon: BarChart3, 
          bgGradient: 'from-blue-300 to-blue-400',
          shadowColor: 'shadow-blue-300/20'
        };
      case 'security':
      case 'cybersecurity':
        return { 
          icon: Shield, 
          bgGradient: 'from-red-300 to-red-400',
          shadowColor: 'shadow-red-300/20'
        };
      case 'technology':
      case 'tech':
        return { 
          icon: Zap, 
          bgGradient: 'from-yellow-300 to-yellow-400',
          shadowColor: 'shadow-yellow-300/20'
        };
      case 'database':
      case 'storage':
        return { 
          icon: Database, 
          bgGradient: 'from-purple-300 to-purple-400',
          shadowColor: 'shadow-purple-300/20'
        };
      case 'web':
      case 'website':
        return { 
          icon: Globe, 
          bgGradient: 'from-indigo-300 to-indigo-400',
          shadowColor: 'shadow-indigo-300/20'
        };
      case 'business':
      case 'enterprise':
        return { 
          icon: Briefcase, 
          bgGradient: 'from-gray-300 to-gray-400',
          shadowColor: 'shadow-gray-300/20'
        };
      case 'operations':
      case 'management':
        return { 
          icon: Settings, 
          bgGradient: 'from-teal-300 to-teal-400',
          shadowColor: 'shadow-teal-300/20'
        };
      default:
        return { 
          icon: ExternalLink, 
          bgGradient: 'from-orange-300 to-orange-400',
          shadowColor: 'shadow-orange-300/20'
        };
    }
  };

  // Show all requisitions, not just deployed ones
  const allProjects = requisitions;

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (allProjects.length === 0) {
    return null; // Don't show section if no projects
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-header mb-4">
            Project Portfolio
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body">
            Explore our comprehensive project portfolio - innovative digital solutions 
            developed by PwC's ET Labs team across various stages of development and deployment.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-10">
          {allProjects.map((app) => {
            const categoryInfo = getCategoryIcon(app.category);
            const IconComponent = categoryInfo.icon;
            const hasDeployedLink = app.deployedLink && app.deployedLink.trim() !== '';
            return (
            <div 
              key={app.id}
              className={`group relative bg-white/98 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 hover:-translate-y-3 transition-all duration-500 overflow-hidden w-full flex flex-col h-full transform hover:scale-[1.02] ${hasDeployedLink ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={hasDeployedLink ? () => window.open(app.deployedLink, '_blank', 'noopener,noreferrer') : undefined}
            >
              {/* Enhanced glassmorphism effect with subtle animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white/40 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 p-[1px]">
                <div className="w-full h-full bg-white rounded-3xl"></div>
              </div>
              
              <div className="relative p-5 flex flex-col flex-1 z-10">
                {/* Enhanced header with optimized spacing */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${categoryInfo.bgGradient} rounded-2xl flex items-center justify-center shadow-xl ${categoryInfo.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20 relative overflow-hidden`}>
                    {/* Icon shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <IconComponent className="text-white text-lg relative z-10" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
                      {app.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded-full">
                        {app.category}
                      </span>
                    </div>
                    
                  </div>
                </div>
                
                {/* Optimized description section */}
                <div className="flex-1 space-y-3">
                  {/* Requester Info */}
                  <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 rounded-xl border border-blue-200/60 group-hover:border-blue-300/80 transition-colors duration-300">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 block truncate">
                        {app.requesterName}
                      </span>
                      <span className="text-xs text-gray-500 block truncate">
                        {app.requesterEmail}
                      </span>
                      
                    </div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                {/* Conditional action button - only show if there's a deployed link */}
                {hasDeployedLink && (
                  <div className="mt-auto pt-3">
                    <Button
                      className="w-full bg-gradient-to-r from-orange-300 to-orange-400 text-white hover:opacity-95 hover:scale-[1.02] transition-all duration-400 shadow-lg shadow-orange-300/20 rounded-xl font-bold py-3.5 text-sm border-0 group-hover:shadow-xl relative overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(app.deployedLink, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <ExternalLink className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">Launch Application</span>
                    </Button>
                  </div>
                )}
                
                {/* Status indicator for projects without deployed links */}
                {!hasDeployedLink && (
                  <div className="mt-auto pt-3">
                    <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 rounded-xl font-medium py-3.5 text-sm border-0 relative overflow-hidden text-center">
                      <span className="relative z-10">In Development</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Showcasing {allProjects.length} project{allProjects.length !== 1 ? 's' : ''} 
            developed by PwC ET Labs
          </p>
        </div>
      </div>
    </section>
  );
}