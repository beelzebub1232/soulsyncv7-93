
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Menu, 
  X
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AdminSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Professional Verifications", href: "/admin/verifications", icon: ShieldCheck },
    { name: "Reports", href: "/admin/reports", icon: AlertTriangle },
    { name: "Content Management", href: "/admin/content", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];
  
  const SidebarContent = () => (
    <>
      <div className="flex items-center flex-shrink-0 px-4 py-5">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary mr-3">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">Admin Panel</span>
      </div>
      <div className="mt-2 flex-1 flex flex-col">
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
                onClick={() => isMobile && setSidebarOpen(false)}
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
    </>
  );
  
  // Mobile sidebar using Sheet component
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-40 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
        </Button>
        
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-gray-800">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-gray-800 dark:bg-gray-900 overflow-y-auto">
        <SidebarContent />
      </div>
    </div>
  );
}
