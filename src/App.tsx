
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";

// Layouts
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Auth Pages
import Auth from "@/pages/auth/Auth";

// App Pages
import Home from "@/pages/home/Home";
import Journal from "@/pages/journal/Journal";
import Community from "@/pages/community/Community";
import ForumCategory from "@/pages/community/ForumCategory";
import Insights from "@/pages/insights/Insights";
import Mindful from "@/pages/mindful/Mindful";
import HabitTracker from "@/pages/habit-tracker/HabitTracker";
import Settings from "@/pages/profile/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Auth />} />
            </Route>
            
            {/* App Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="journal" element={<Journal />} />
              <Route path="community" element={<Community />} />
              <Route path="community/:categoryId" element={<ForumCategory />} />
              <Route path="insights" element={<Insights />} />
              <Route path="mindful" element={<Mindful />} />
              <Route path="habit-tracker" element={<HabitTracker />} />
              <Route path="profile/settings" element={<Settings />} />
            </Route>
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
