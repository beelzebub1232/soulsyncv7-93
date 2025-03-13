
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Settings 
} from "lucide-react";

export function AdminBottomNav() {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
    { name: "Reports", href: "/admin/reports", icon: AlertTriangle },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-gray-800 border-t border-gray-700 md:hidden">
      <div className="grid h-full grid-cols-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/admin" && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-1 text-xs",
                isActive
                  ? "text-primary font-medium"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-primary" : "text-gray-400"
                )}
              />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
