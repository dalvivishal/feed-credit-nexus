
import { toast } from "sonner";
import { getCookie, setCookie, removeCookie } from "../cookies";

// Set the base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const token = getCookie("eduhub_token");

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// Authentication API calls
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await handleResponse(response);
      setCookie("eduhub_token", data?.data?.token);
      setCookie("eduhub_user", JSON.stringify(data?.data?.user));
      return data;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await handleResponse(response);

      // Store token and user data in cookies

      console.log("logindata", data);
      setCookie("eduhub_token", data?.token);
      setCookie("eduhub_user", JSON.stringify(data?.data?.user));

      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  },

  logout: async () => {
    removeCookie("eduhub_token");
    removeCookie("eduhub_user");
    return { success: true };
  },

  getCurrentUser: () => {
    const userString = getCookie("eduhub_user");
    return userString ? JSON.parse(userString) : null;
  },

  isAuthenticated: () => {
    return !!token;
  },

  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user?.role === "admin";
  },

  isModerator: () => {
    const user = authAPI.getCurrentUser();
    return user?.role === "moderator" || user?.role === "admin";
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      throw new Error(error.message || "Failed to fetch profile");
    }
  }
};

export default authAPI;