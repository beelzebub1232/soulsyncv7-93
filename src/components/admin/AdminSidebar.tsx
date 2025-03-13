
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Home 
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Professional Verifications", href: "/admin/verifications", icon: ShieldCheck },
    { name: "Reports", href: "/admin/reports", icon: AlertTriangle },
    { name: "Content Management", href: "/admin/content", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-gray-800 dark:bg-gray-900 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 mr-3">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </div>
        <div className="mt-6 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/admin" && location.pathname.startsWith(item.href));
                
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
