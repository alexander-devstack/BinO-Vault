import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Simple authentication state - session handled by cookies
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user has logged in (sessionToken in localStorage)
    return localStorage.getItem('sessionToken') !== null;
  });
  
  const [loading, setLoading] = useState(false);

  // Login function (called from Login component)
  const login = (sessionToken) => {
    localStorage.setItem('sessionToken', sessionToken);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('sessionToken');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
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
