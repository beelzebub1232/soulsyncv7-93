
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useUser } from "./UserContext";

export type NotificationType = 'post' | 'reply' | 'like' | 'verification' | 'report';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  date: Date;
  targetId?: string; // ID of post, reply, etc.
  userId?: string; // Who the notification is for
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    if (!user) return;
    
    try {
      const savedNotifications = localStorage.getItem(`soulsync_notifications_${user.id}`);
      if (savedNotifications) {
        // Parse dates properly
        const parsedNotifications = JSON.parse(savedNotifications, (key, value) => {
          if (key === 'date') return new Date(value);
          return value;
        });
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, [user]);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (!user) return;
    if (notifications.length > 0) {
      localStorage.setItem(`soulsync_notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);
  
  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    if (!user) return;
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      read: false,
      userId: notification.userId || user.id,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for the new notification
    toast({
      title: `New ${notification.type}`,
      description: notification.message,
    });
  };
  
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true } 
          : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`soulsync_notifications_${user.id}`);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        clearAllNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
