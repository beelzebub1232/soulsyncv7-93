
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { NotificationPanel } from "./NotificationPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronsUpDown 
} from "lucide-react";

export function TopNavbar() {
  const { user, logout } = useUser();
  const location = useLocation();
  
  const getPageTitle = (pathname: string) => {
    const routes: Record<string, string> = {
      "/": "Home",
      "/journal": "Journal",
      "/community": "Community",
      "/insights": "Insights",
      "/mindful": "Mindfulness",
      "/habit-tracker": "Habit Tracker",
      "/profile/settings": "Settings",
    };
    
    // Handle community sub-routes
    if (pathname.startsWith("/community/category/")) {
      return "Community";
    }
    
    if (pathname.startsWith("/community/post/")) {
      return "Discussion";
    }
    
    return routes[pathname] || "SoulSync";
  };
  
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="mr-4 flex">
          <Link
            to="/"
            className="mr-6 flex items-center space-x-2 font-display text-xl font-bold"
          >
            <span className="hidden sm:inline-block">SoulSync</span>
          </Link>
          <div className="font-display font-medium hidden sm:block">
            {getPageTitle(location.pathname)}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-end space-x-2">
          {user ? (
            <>
              <NotificationPanel />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.username}
                      />
                      <AvatarFallback className={cn(
                        user.role === "professional" ? "bg-blue-100" :
                        user.role === "admin" ? "bg-purple-100" : "bg-gray-100"
                      )}>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{user.username}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile/settings" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
