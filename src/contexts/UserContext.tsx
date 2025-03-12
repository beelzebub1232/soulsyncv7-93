
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'user' | 'professional' | 'admin';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
}

// Mock user database
const mockUsers: { [key: string]: { password: string } & UserData } = {};

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'soulsync_user_v2';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Validate stored user data
          if (parsedUser && parsedUser.email && parsedUser.id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Validate input
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user exists
      const storedUser = mockUsers[email];
      if (!storedUser || storedUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      const userData: UserData = {
        id: storedUser.id,
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role,
        avatar: storedUser.avatar,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.username}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Validate input
      if (!username.trim()) {
        throw new Error('Username is required');
      }
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      if (mockUsers[email]) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        role,
        password,
        avatar: '/placeholder.svg',
      };

      mockUsers[email] = newUser;

      const userData: UserData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Account created!",
        description: "Welcome to SoulSync!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    // Clear app-specific data
    localStorage.removeItem('soulsync_moods');
    localStorage.removeItem('soulsync_habits');
    localStorage.removeItem('soulsync_journal');
    
    toast({
      title: "Logged out",
      description: "Come back soon!",
    });
  };

  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email] = { ...mockUsers[user.email], ...data };
      }
      
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout, 
        updateUser 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
