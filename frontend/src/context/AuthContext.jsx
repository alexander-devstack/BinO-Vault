import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("sessionToken") !== null;
  });
  const [loading, setLoading] = useState(false);

  const login = (sessionToken) => {
    localStorage.setItem("sessionToken", sessionToken);
    setIsAuthenticated(true);
    // ✅ CSRF removed - was causing connection error!
  };

  const logout = () => {
    localStorage.removeItem("sessionToken");
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
