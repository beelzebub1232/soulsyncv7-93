
import { Plus, Bell } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Notification } from "@/types/community";
import { NotificationPanel } from "./NotificationPanel";
import { useUser } from "@/contexts/UserContext";

export function CommunityHeader() {
  const { user } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      userId: "user123",
      type: "reply",
      content: "Someone replied to your post about meditation",
      relatedId: "post123",
      date: new Date(),
      read: false
    },
    {
      id: "2",
      userId: "user123",
      type: "like",
      content: "Your post received a new like",
      relatedId: "post456",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Community</h1>
        <p className="text-muted-foreground">Connect and share with others</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-10 h-10 rounded-full bg-background border border-input flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        
        <button 
          className="w-10 h-10 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
          aria-label="New Post"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-[90%] sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <NotificationPanel 
            notifications={notifications}
            onMarkAsRead={(id) => {
              setNotifications(prev => 
                prev.map(n => n.id === id ? {...n, read: true} : n)
              );
            }}
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}
