
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Bell, MessageCircleAlert, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const { user } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  
  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50",
        className
      )}>
        {/* Crisis Button (Left) */}
        <button 
          onClick={() => setCrisisOpen(true)}
          className="button-crisis flex items-center gap-1"
        >
          <MessageCircleAlert className="h-4 w-4" />
          <span>Crisis Help</span>
        </button>
        
        {/* App Name (Center) */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-mindscape-primary flex items-center justify-center">
            <span className="text-white font-semibold text-xs">MJ</span>
          </div>
          <h1 className="text-lg font-display font-medium">Mindscape</h1>
        </Link>
        
        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-mindscape-light transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-mindscape-primary rounded-full"></span>
          </button>
          
          <button 
            onClick={() => setProfileOpen(true)}
            className="rounded-full p-1 border-2 border-mindscape-primary hover:bg-mindscape-light transition-colors overflow-hidden"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-6 h-6 rounded-full object-cover" 
              />
            ) : (
              <User className="h-5 w-5" />
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
              <Link to="/profile/settings" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors">
                Settings
              </Link>
              <Link to="/profile/insights" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors">
                My Insights
              </Link>
              <Link to="/habit-tracker" className="block w-full p-3 rounded-lg hover:bg-mindscape-light transition-colors">
                Habit Tracker
              </Link>
              <button className="w-full p-3 rounded-lg text-left hover:bg-mindscape-light text-destructive transition-colors" onClick={() => {
                // Add logout logic here
                setProfileOpen(false);
              }}>
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
    </>
  );
}
