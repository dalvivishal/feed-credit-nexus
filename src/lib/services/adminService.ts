import { getCookie } from "../cookies";
import authAPI from "./authService";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  source: 'twitter' | 'reddit' | 'linkedin';
  author: string;
  timestamp: string;
  imageUrl?: string;
  url: string;
  tags: string[];
  likes: number;
  saved: boolean;
  flagged: boolean;
}

// Mock credit transaction
export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent';
  reason: string;
  timestamp: string;
}

// Set the base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || "https://feed-credit-nexus.onrender.com/api";
const token = getCookie("eduhub_token");

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("Dashboard stats error:", error);
      throw new Error(error.message || "Failed to fetch dashboard stats");
    }
  },

  getAllUsers: async (filters: Record<string, string> = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const queryString = queryParams.toString();
      const url = `${API_URL}/admin/users${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("Users fetch error:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  getFlaggedContent: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/flagged-content`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("Flagged content fetch error:", error);
      throw new Error(error.message || "Failed to fetch flagged content");
    }
  },

  getAllReports: async (filters: Record<string, string> = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const queryString = queryParams.toString();
      const url = `${API_URL}/admin/reports${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("Reports fetch error:", error);
      throw new Error(error.message || "Failed to fetch reports");
    }
  },

  getUserStats: async () => {
    await delay(800);
    if (!authAPI.isAdmin()) {
      throw new Error('Unauthorized');
    }

    const url = `${API_URL}/admin/stats`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    const totalUsers = data?.data?.users?.total;
    const activeUsers = totalUsers - 1; // Just for mock data
    const adminUsers = data?.data?.users?.admins; // Just for mock data

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      topSavedContent: data?.data?.topSavedContent || [],
      mostActiveUsers: data?.data?.topUsers || []
    };
  },

  resolveReport: async (reportId: string, data: { resolution: string; action: 'remove' | 'restore' | 'ignore' }) => {
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("Report resolve error:", error);
      throw new Error(error.message || "Failed to resolve report");
    }
  },

  updateUserRole: async (userId: string, role: 'user' | 'moderator' | 'admin') => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("User role update error:", error);
      throw new Error(error.message || "Failed to update user role");
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("User status update error:", error);
      throw new Error(error.message || "Failed to update user status");
    }
  }
};

export default adminAPI;
