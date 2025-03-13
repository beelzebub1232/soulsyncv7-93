
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'user' | 'professional' | 'admin';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  occupation?: string;
  identityDocument?: string;
}

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  professionalLogin: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole, occupation?: string, identityDocument?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  pendingProfessionals: UserData[];
  verifyProfessional: (professionalId: string) => void;
  rejectProfessional: (professionalId: string) => void;
}

// Mock user database
const mockUsers: { [key: string]: { password: string } & UserData } = {
  'admin@gmail.com': {
    id: 'admin-1',
    username: 'Admin',
    email: 'admin@gmail.com',
    password: '123',
    role: 'admin',
    avatar: '/placeholder.svg',
    isVerified: true
  }
};

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'soulsync_user_v2';
const PENDING_PROFESSIONALS_KEY = 'pending_professionals';
const APPROVED_TOAST_KEY = 'approved_professional_notifications';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingProfessionals, setPendingProfessionals] = useState<UserData[]>([]);
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
        
        // Load pending professionals from localStorage
        const savedPendingProfessionals = localStorage.getItem(PENDING_PROFESSIONALS_KEY);
        if (savedPendingProfessionals) {
          setPendingProfessionals(JSON.parse(savedPendingProfessionals));
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

  // Check for approval notifications
  useEffect(() => {
    const checkForApprovalNotifications = () => {
      try {
        const notificationsJson = localStorage.getItem(APPROVED_TOAST_KEY);
        if (notificationsJson) {
          const notifications = JSON.parse(notificationsJson);
          
          // Show notifications and remove them
          notifications.forEach((notification: { email: string; username: string }) => {
            toast({
              title: "Professional Account Approved",
              description: `Your professional account has been approved. You can now login.`,
            });
          });
          
          // Clear notifications after showing them
          localStorage.removeItem(APPROVED_TOAST_KEY);
        }
      } catch (error) {
        console.error('Failed to process approval notifications:', error);
      }
    };

    checkForApprovalNotifications();
  }, [toast]);

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

      // Don't allow admin or professional login through regular login
      if (storedUser.role === 'admin') {
        throw new Error('Please use the admin login');
      }
      
      if (storedUser.role === 'professional') {
        throw new Error('Please use the professional login');
      }

      const userData: UserData = {
        id: storedUser.id,
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role,
        avatar: storedUser.avatar,
        isVerified: storedUser.isVerified,
        occupation: storedUser.occupation,
        identityDocument: storedUser.identityDocument,
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
  
  const professionalLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Validate input
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if professional exists
      const storedUser = mockUsers[email];
      if (!storedUser || storedUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Verify it's a professional account
      if (storedUser.role !== 'professional') {
        throw new Error('This login is only for professional accounts');
      }
      
      // Check if the professional is verified
      if (!storedUser.isVerified) {
        throw new Error('Your account is pending verification. Please wait for admin approval.');
      }

      const userData: UserData = {
        id: storedUser.id,
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role,
        avatar: storedUser.avatar,
        isVerified: storedUser.isVerified,
        occupation: storedUser.occupation,
        identityDocument: storedUser.identityDocument,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Welcome back, Professional!",
        description: `Logged in as ${userData.username}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Professional login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Admin validation
      if (email !== 'admin@gmail.com') {
        throw new Error('Invalid admin credentials');
      }
      
      if (password !== '123') {
        throw new Error('Invalid admin credentials');
      }

      const adminUser = mockUsers['admin@gmail.com'];
      
      const userData: UserData = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: 'admin',
        avatar: adminUser.avatar,
        isVerified: true
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Admin login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    role: UserRole, 
    occupation?: string, 
    identityDocument?: string
  ) => {
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

      // For professional role, require occupation
      if (role === 'professional' && !occupation) {
        throw new Error('Occupation is required for professional accounts');
      }

      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        role,
        password,
        avatar: '/placeholder.svg',
        isVerified: role === 'user', // Regular users are auto-verified
        occupation,
        identityDocument,
      };

      // Add to mock database
      mockUsers[email] = newUser;

      // If professional, add to pending list
      if (role === 'professional') {
        const updatedPendingList = [...pendingProfessionals, newUser];
        setPendingProfessionals(updatedPendingList);
        localStorage.setItem(PENDING_PROFESSIONALS_KEY, JSON.stringify(updatedPendingList));
        
        toast({
          title: "Professional Registration Pending",
          description: "Your account will be activated after verification by an admin.",
        });
        
        return;
      }

      toast({
        title: "Account created!",
        description: "Your account has been created successfully. Please sign in.",
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

  const verifyProfessional = (professionalId: string) => {
    const updatedPending = pendingProfessionals.filter(p => p.id !== professionalId);
    const professional = pendingProfessionals.find(p => p.id === professionalId);
    
    if (professional) {
      // Update the professional's verified status
      if (mockUsers[professional.email]) {
        mockUsers[professional.email].isVerified = true;
        
        // Store approval notification
        const notificationsJson = localStorage.getItem(APPROVED_TOAST_KEY) || '[]';
        const notifications = JSON.parse(notificationsJson);
        notifications.push({
          email: professional.email,
          username: professional.username
        });
        localStorage.setItem(APPROVED_TOAST_KEY, JSON.stringify(notifications));
      }
      
      // Update pending professionals list
      setPendingProfessionals(updatedPending);
      localStorage.setItem(PENDING_PROFESSIONALS_KEY, JSON.stringify(updatedPending));
      
      toast({
        title: "Professional Verified",
        description: `${professional.username} has been approved as a professional.`,
      });
    }
  };

  const rejectProfessional = (professionalId: string) => {
    const updatedPending = pendingProfessionals.filter(p => p.id !== professionalId);
    const professional = pendingProfessionals.find(p => p.id === professionalId);
    
    if (professional) {
      // Remove from mock users
      delete mockUsers[professional.email];
      
      // Update pending professionals list
      setPendingProfessionals(updatedPending);
      localStorage.setItem(PENDING_PROFESSIONALS_KEY, JSON.stringify(updatedPending));
      
      toast({
        title: "Professional Rejected",
        description: `${professional.username}'s professional application has been rejected.`,
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
        professionalLogin,
        adminLogin,
        register, 
        logout, 
        updateUser,
        pendingProfessionals,
        verifyProfessional,
        rejectProfessional
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
