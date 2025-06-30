import { Link, useLocation } from "wouter";
import { Home, Settings, BarChart3, Layers } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      path: "/admin",
      label: "Admin Panel",
      icon: Settings,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center">
          <Layers className="text-blue-600 mr-3 h-6 w-6" />
          App Directory
        </h1>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <button className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}>
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
