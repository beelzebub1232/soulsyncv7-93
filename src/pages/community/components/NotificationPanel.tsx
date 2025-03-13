
import { formatDistanceToNow } from "date-fns";
import { Bell, Heart, MessageSquare, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Notification } from "@/types/community";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationPanel({ notifications, onMarkAsRead }: NotificationPanelProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-40 text-center text-muted-foreground">
        <Bell className="h-10 w-10 mb-3 opacity-20" />
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
      <div className="space-y-2">
        {notifications.map((notification) => (
          <Link
            key={notification.id}
            to={notification.url || '#'}
            className={cn(
              "p-3 rounded-lg transition-colors block",
              notification.read ? "bg-accent/50" : "bg-accent"
            )}
            onClick={() => {
              if (!notification.read) {
                onMarkAsRead(notification.id);
              }
              if (!notification.url) {
                // Prevent navigation if there's no URL
                return;
              }
            }}
          >
            <div className="flex gap-3">
              <div className="mt-1">
                {notification.type === 'reply' && (
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                )}
                {notification.type === 'like' && (
                  <Heart className="h-5 w-5 text-red-500" />
                )}
                {notification.type === 'report' && (
                  <ShieldAlert className="h-5 w-5 text-orange-500" />
                )}
                {notification.type === 'verification' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-500" />
                )}
                {notification.type === 'system' && (
                  <Bell className="h-5 w-5 text-yellow-500" />
                )}
                {notification.type === 'user' && (
                  <Bell className="h-5 w-5 text-purple-500" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm",
                  !notification.read && "font-medium"
                )}>
                  {notification.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(notification.date, { addSuffix: true })}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-mindscape-primary self-start mt-2" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}
