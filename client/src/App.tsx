import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import ProjectRequisition from "@/pages/project-requisition";
import NotFound from "@/pages/not-found";
import { Footer } from "@/components/footer";

// App prefix configuration
const APP_PREFIX = "/app-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to={`${APP_PREFIX}/`} />} />
      <Route path={`${APP_PREFIX}/`} component={Dashboard} />
      <Route path={`${APP_PREFIX}/admin`} component={Admin} />
      <Route path={`${APP_PREFIX}/project-requisition`} component={ProjectRequisition} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1">
            <Router />
          </div>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
