import axios from "axios";

// Base URL for your Flask backend
const API_BASE_URL = "http://localhost:5000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session cookies
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

  // Logout
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  // Verify if session is valid
  verify: async () => {
    const response = await apiClient.get("/auth/verify");
    return response.data;
  },

  // Generate recovery key
  generateRecoveryKey: async () => {
    const response = await apiClient.post("/auth/recovery-key");
    return response.data;
  },
};

// ==================== PASSWORD API ====================
export const passwordAPI = {
  // Get all passwords
  getAll: async () => {
    const response = await apiClient.get("/passwords");
    return response.data;
  },

  // Get single password by ID
  getById: async (id) => {
    const response = await apiClient.get(`/passwords/${id}`);
    return response.data;
  },

  // Create new password
  create: async (passwordData) => {
    const response = await apiClient.post("/passwords", passwordData);
    return response.data;
  },

  // Update existing password
  update: async (id, passwordData) => {
    const response = await apiClient.put(`/passwords/${id}`, passwordData);
    return response.data;
  },

  // Delete password
  delete: async (id) => {
    const response = await apiClient.delete(`/passwords/${id}`);
    return response.data;
  },
};
