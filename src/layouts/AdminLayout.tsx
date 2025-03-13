
import { useUser } from "@/contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBottomNav } from "@/components/admin/AdminBottomNav";

export function AdminLayout() {
  const { user, isLoading } = useUser();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="animate-pulse-soft text-center">
          <div className="h-10 w-10 rounded-full bg-gray-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth if not logged in or not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth/admin" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background pb-20 md:pb-6">
          <Outlet />
        </main>
        <AdminBottomNav />
      </div>
    </div>
  );
}
