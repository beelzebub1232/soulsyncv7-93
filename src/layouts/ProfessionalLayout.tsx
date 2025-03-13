
import { useUser } from "@/contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";
import { ProfessionalHeader } from "@/components/professional/ProfessionalHeader";
import { ProfessionalBottomNav } from "@/components/professional/ProfessionalBottomNav";

export function ProfessionalLayout() {
  const { user, isLoading } = useUser();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="animate-pulse-soft text-center">
          <div className="h-10 w-10 rounded-full bg-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth if not logged in or not a professional
  if (!user || user.role !== 'professional') {
    return <Navigate to="/auth/professional" replace />;
  }
  
  return (
    <div className="flex h-screen flex-col bg-background">
      <ProfessionalHeader />
      <main className="flex-1 overflow-y-auto pt-16 pb-20 px-4">
        <Outlet />
      </main>
      <ProfessionalBottomNav />
    </div>
  );
}
