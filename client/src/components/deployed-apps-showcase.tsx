import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Calendar, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

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

  // Filter requisitions that have deployed links
  const deployedApps = requisitions.filter(req => req.deployedLink && req.deployedLink.trim() !== '');

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

  if (deployedApps.length === 0) {
    return null; // Don't show section if no deployed apps
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-header mb-4">
            Deployed Applications
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body">
            Explore our successfully deployed project requisitions - innovative solutions 
            built to address real business needs and enhance operational efficiency.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployedApps.map((app) => (
            <Card key={app.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 font-header line-clamp-2">
                      {app.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      {app.category}
                    </CardDescription>
                  </div>
                  {app.logo && (
                    <div className="ml-3 flex-shrink-0">
                      <img 
                        src={app.logo} 
                        alt={`${app.title} logo`}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Description */}
                <div 
                  className="text-sm text-gray-700 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: app.description }}
                />

                {/* Status and Priority Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`text-xs ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                  <Badge className={`text-xs ${getPriorityColor(app.priority)}`}>
                    {app.priority.charAt(0).toUpperCase() + app.priority.slice(1)} Priority
                  </Badge>
                </div>

                {/* Requester Info */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <User className="w-3 h-3 mr-1" />
                  <span>{app.requesterName}</span>
                  {app.expectedDelivery && (
                    <>
                      <Calendar className="w-3 h-3 ml-3 mr-1" />
                      <span>{new Date(app.expectedDelivery).toLocaleDateString()}</span>
                    </>
                  )}
                </div>

                {/* Demo Button */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  <a
                    href={app.deployedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Demo
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Showing {deployedApps.length} deployed application{deployedApps.length !== 1 ? 's' : ''} 
            from our project requisitions
          </p>
        </div>
      </div>
    </section>
  );
}