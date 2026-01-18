import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('sessionToken');
    if (token) {
      verifySession(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Verify session with backend
  const verifySession = async (token) => {
    try {
      await authAPI.verify(token);
      setSessionToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Session verification failed:', error);
      sessionStorage.removeItem('sessionToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (masterPassword) => {
    try {
      const response = await authAPI.login(masterPassword);
      const token = response.session_token;
      
      // Store token in sessionStorage
      sessionStorage.setItem('sessionToken', token);
      setSessionToken(token);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Invalid master password' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (sessionToken) {
        await authAPI.logout(sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.removeItem('sessionToken');
      setSessionToken(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    sessionToken,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
