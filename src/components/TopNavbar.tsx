
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Bell, AlertCircle, User, Settings, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const { user, logout } = useUser();
  const { toast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
  };
  
  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 px-3 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50",
        className
      )}>
        {/* Crisis Button (Left) - more compact */}
        <button 
          onClick={() => setCrisisOpen(true)}
          className="h-8 px-2 bg-crisis text-white rounded-full flex items-center justify-center gap-1 text-xs font-medium hover:bg-crisis-hover transition-colors"
          aria-label="Crisis Help"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span className="mr-0.5">Help</span>
        </button>
        
        {/* App Name (Center) */}
        <Link to="/" className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          <div className="h-7 w-7 rounded-full bg-mindscape-primary flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-base font-display font-medium">SoulSync</h1>
        </Link>
        
        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setNotificationsOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-mindscape-light transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mindscape-primary rounded-full"></span>
          </button>
          
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-8 h-8 rounded-full border-2 border-mindscape-primary hover:bg-mindscape-light transition-colors overflow-hidden flex items-center justify-center"
            aria-label="Profile"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Profile Drawer */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="glassmorphism">
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
          </SheetHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-mindscape-light flex items-center justify-center overflow-hidden border-2 border-mindscape-primary">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="h-10 w-10 text-mindscape-primary" />
              )}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user?.username || 'Guest'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || 'Not signed in'}</p>
            </div>
            
            <div className="w-full mt-4 space-y-2">
              <Link to="/profile/settings" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <Link to="/profile/insights" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors">
                My Insights
              </Link>
              <Link to="/habit-tracker" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors">
                Habit Tracker
              </Link>
              <button 
                className="w-full p-3 rounded-lg text-left hover:bg-mindscape-light text-destructive transition-colors"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Crisis Help Sheet */}
      <Sheet open={crisisOpen} onOpenChange={setCrisisOpen}>
        <SheetContent side="left" className="glassmorphism border-r border-crisis/30">
          <SheetHeader>
            <SheetTitle className="text-crisis">Crisis Help</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p className="text-sm">
              If you're experiencing a mental health emergency, please contact one of these crisis helplines immediately.
            </p>
            
            <div className="space-y-3">
              <div className="card-primary border-crisis/30">
                <h3 className="font-medium">National Mental Health Helpline (India)</h3>
                <a href="tel:+911800599599" className="block text-lg font-semibold text-primary mt-1">
                  1800-599-599
                </a>
              </div>
              
              <div className="card-primary border-crisis/30">
                <h3 className="font-medium">Crisis Text Line</h3>
                <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
              </div>
              
              <div className="card-primary border-crisis/30">
                <h3 className="font-medium">Emergency Services</h3>
                <a href="tel:112" className="block text-lg font-semibold text-primary mt-1">
                  112
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium mb-2">Personal Emergency Contacts</h4>
              <button className="button-secondary w-full flex justify-center">
                Add Contact
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Notifications Sheet */}
      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent side="right" className="glassmorphism">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-3">
              <div className="card-primary border-l-4 border-mindscape-primary">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Daily Check-in Reminder</h3>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <p className="text-sm mt-1">
                  How are you feeling today? Don't forget to track your mood.
                </p>
              </div>
              
              <div className="card-primary border-l-4 border-green-400">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Habit Completed!</h3>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <p className="text-sm mt-1">
                  You've completed your meditation habit 7 days in a row. Great job!
                </p>
              </div>
              
              <div className="card-primary border-l-4 border-blue-400">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">New Mindfulness Session</h3>
                  <span className="text-xs text-muted-foreground">2d ago</span>
                </div>
                <p className="text-sm mt-1">
                  A new guided meditation has been added: "Evening Wind Down"
                </p>
              </div>
            </div>
            
            <div className="pt-4 text-center">
              <button className="button-secondary">
                Clear All Notifications
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
