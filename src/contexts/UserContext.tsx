
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ProfessionalVerificationRequest } from '@/types/community';

export type UserRole = 'user' | 'professional' | 'admin';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  occupation?: string;
  isVerified?: boolean;
}

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole, occupation?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  submitProfessionalVerification: (occupation: string, documentUrl: string) => Promise<void>;
  getProfessionalRequests: () => ProfessionalVerificationRequest[];
  approveProfessional: (requestId: string) => void;
  rejectProfessional: (requestId: string) => void;
}

// Mock user database
const mockUsers: { [key: string]: { password: string } & UserData } = {};
// Mock professional verification requests
const mockProfessionalRequests: ProfessionalVerificationRequest[] = [];

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'soulsync_user_v2';
const PROFESSIONAL_REQUESTS_KEY = 'soulsync_professional_requests';

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
        
        // Load professional requests
        const savedRequests = localStorage.getItem(PROFESSIONAL_REQUESTS_KEY);
        if (savedRequests) {
          const parsedRequests: ProfessionalVerificationRequest[] = JSON.parse(savedRequests);
          parsedRequests.forEach(request => {
            mockProfessionalRequests.push(request);
          });
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
        occupation: storedUser.occupation,
        isVerified: storedUser.isVerified
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

  const register = async (username: string, email: string, password: string, role: UserRole, occupation?: string) => {
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
      if (role === 'professional' && !occupation) {
        throw new Error('Occupation is required for professional accounts');
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
        occupation,
        isVerified: role !== 'professional', // Professionals need verification
      };

      mockUsers[email] = newUser;

      const userData: UserData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        occupation: newUser.occupation,
        isVerified: newUser.isVerified
      };

      // If user is a professional, they need verification before full access
      if (role === 'professional') {
        toast({
          title: "Account created",
          description: "Your professional account requires verification. Please submit your credentials.",
        });
      } else {
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        
        toast({
          title: "Account created!",
          description: "Welcome to SoulSync!",
        });
      }
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

  const submitProfessionalVerification = async (occupation: string, documentUrl: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      if (!occupation.trim()) {
        throw new Error('Occupation is required');
      }
      
      if (!documentUrl.trim()) {
        throw new Error('Identification document is required');
      }
      
      const request: ProfessionalVerificationRequest = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: user.username,
        email: user.email,
        occupation,
        documentUrl,
        status: 'pending',
        submissionDate: new Date()
      };
      
      mockProfessionalRequests.push(request);
      localStorage.setItem(PROFESSIONAL_REQUESTS_KEY, JSON.stringify(mockProfessionalRequests));
      
      // Update user occupation
      const updatedUser = { ...user, occupation };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      toast({
        title: "Verification submitted",
        description: "Your professional account is pending verification.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  };
  
  const getProfessionalRequests = () => {
    // Filter to only return pending requests for admins
    return mockProfessionalRequests.filter(request => request.status === 'pending');
  };
  
  const approveProfessional = (requestId: string) => {
    const requestIndex = mockProfessionalRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return;
    
    const request = mockProfessionalRequests[requestIndex];
    mockProfessionalRequests[requestIndex] = {
      ...request,
      status: 'approved',
      reviewDate: new Date(),
      reviewedBy: user?.id
    };
    
    // Update the user to be verified
    if (mockUsers[request.email]) {
      mockUsers[request.email].isVerified = true;
      
      // If this is the currently logged in user, update state
      if (user && user.email === request.email) {
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      }
    }
    
    localStorage.setItem(PROFESSIONAL_REQUESTS_KEY, JSON.stringify(mockProfessionalRequests));
    
    toast({
      title: "Professional verified",
      description: `${request.username} has been approved as a professional.`,
    });
  };
  
  const rejectProfessional = (requestId: string) => {
    const requestIndex = mockProfessionalRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return;
    
    const request = mockProfessionalRequests[requestIndex];
    mockProfessionalRequests[requestIndex] = {
      ...request,
      status: 'rejected',
      reviewDate: new Date(),
      reviewedBy: user?.id
    };
    
    localStorage.setItem(PROFESSIONAL_REQUESTS_KEY, JSON.stringify(mockProfessionalRequests));
    
    toast({
      title: "Professional rejected",
      description: `${request.username}'s professional verification has been rejected.`,
    });
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
        updateUser,
        submitProfessionalVerification,
        getProfessionalRequests,
        approveProfessional,
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
