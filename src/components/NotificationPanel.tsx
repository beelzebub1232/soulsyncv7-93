
import React from 'react';
import { useNotification, Notification } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, MessageSquare, Heart, Flag, User, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

export function NotificationPanel() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications 
  } = useNotification();
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'post':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'reply':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'report':
        return <Flag className="h-4 w-4 text-orange-500" />;
      case 'verification':
        return <BadgeCheck className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    // Navigation could be added here in the future
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                Clear all
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[calc(80vh-8rem)] max-h-[450px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-4 transition-colors hover:bg-accent cursor-pointer",
                    !notification.read && "bg-accent/50"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.date, { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
