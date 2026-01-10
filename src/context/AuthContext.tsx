// ============================================
// FILE 1: frontend/src/context/AuthContext.tsx - FIXED
// ============================================
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';

interface AuthContextType {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  login: (email: string) => void;  // ✅ Changed: Only needs email now
  logout: () => void;
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const savedSession = localStorage.getItem('adminSession');
    const token = localStorage.getItem('adminToken');
    
    if (savedSession && token) {
      try {
        const sessionData = JSON.parse(savedSession);
        const now = Date.now();
        
        // Check if session is still valid (within 15 minutes)
        if (now - sessionData.timestamp < SESSION_TIMEOUT) {
          setIsAdminLoggedIn(true);
          setAdminEmail(sessionData.email);
          resetSessionTimer();
        } else {
          // Session expired, clear it
          logout();
          setSessionExpired(true);
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        logout();
      }
    }
  }, []);

  // Reset the session timer
  const resetSessionTimer = () => {
    // Clear existing timer
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      logout(); // Automatically logout when timer expires
      setSessionExpired(true);
    }, SESSION_TIMEOUT);
    
    setSessionTimer(timer);
  };

  // Reset timer on user activity
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const handleUserActivity = () => {
      resetSessionTimer();
    };

    // Listen for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Set initial timer
    resetSessionTimer();

    return () => {
      // Cleanup event listeners and timer
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, [isAdminLoggedIn]);

  // ✅ FIXED: No password check here - backend already validated it
  const login = (email: string): void => {
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    setSessionExpired(false);
    
    // Save session
    localStorage.setItem('adminSession', JSON.stringify({ 
      email, 
      timestamp: Date.now() 
    }));
    
    resetSessionTimer(); // Start the session timer
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    
    // Clear all stored data
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    
    // Show logout success message
    toast.success('Successfully logged out!');
    
    // Clear timer
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAdminLoggedIn, 
      adminEmail, 
      login, 
      logout, 
      sessionExpired, 
      setSessionExpired 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}