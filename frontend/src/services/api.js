import axios from "axios";

// Base URL for your Flask backend
const API_BASE_URL = "http://localhost:5000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CRITICAL: Sends session cookies
});

// ==================== AUTH API ====================
export const authAPI = {
  // Register new user
  register: async (masterPassword) => {
    const response = await apiClient.post("/auth/register", {
      master_password: masterPassword,
    });
    return response.data;
  },

  // Login
  login: async (masterPassword) => {
    const response = await apiClient.post("/auth/login", {
      master_password: masterPassword,
    });
    return response.data;
  },
};

// ==================== PASSWORD API ====================
export const passwordAPI = {
  // Get all passwords
  getAll: async () => {
    const response = await apiClient.get("/api/passwords/");
    return response.data;
  },

  // Create new password
  create: async (passwordData) => {
    const response = await apiClient.post("/api/passwords/", passwordData);
    return response.data;
  },

  // Delete password
  delete: async (id) => {
    const response = await apiClient.delete(`/api/passwords/${id}`);
    return response.data;
  },

  // Generate secure password
  generate: async (options = {}) => {
    const response = await apiClient.post("/api/passwords/generate", options);
    return response.data;
  },
};
