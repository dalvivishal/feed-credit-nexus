
import { toast } from "sonner";
import { getCookie } from "../cookies";

// Set the base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || "https://feed-credit-nexus.onrender.com/api";
const token = getCookie("eduhub_token");

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// Content API calls
export const contentAPI = {
  getAllContent: async (filters: Record<string, string> = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const queryString = queryParams.toString();
      const url = `${API_URL}/content${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await handleResponse(response);
      return data.data.content;
    } catch (error: any) {
      console.error("Content fetch error:", error);
      throw new Error(error.message || "Failed to fetch content");
    }
  },

  getContentById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.data.content;
    } catch (error: any) {
      console.error("Content fetch error:", error);
      throw new Error(error.message || "Failed to fetch content");
    }
  },

  saveContent: async (contentId: string) => {
    try {
      const response = await fetch(`${API_URL}/content/${contentId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.data.content;
    } catch (error: any) {
      console.error("Content save error:", error);
      throw new Error(error.message || "Failed to save content");
    }
  },

  unsaveContent: async (contentId: string) => {
    try {
      const response = await fetch(`${API_URL}/content/${contentId}/unsave`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.data.content;
    } catch (error: any) {
      console.error("Content unsave error:", error);
      throw new Error(error.message || "Failed to unsave content");
    }
  },

  flagContent: async (contentId: string, reason: string) => {
    try {
      const response = await fetch(`${API_URL}/content/${contentId}/flag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      const data = await handleResponse(response);
      toast.success("Content has been reported to moderators");
      return data.data.content;
    } catch (error: any) {
      console.error("Content flag error:", error);
      throw new Error(error.message || "Failed to flag content");
    }
  },

  shareContent: async (contentId: string) => {
    try {
      const response = await fetch(`${API_URL}/content/${contentId}/share`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      toast.success(`Content shared! +${data.data.creditsEarned || 10} credits`);
      return data.data;
    } catch (error: any) {
      console.error("Content share error:", error);
      throw new Error(error.message || "Failed to share content");
    }
  },

  getSavedContent: async () => {
    try {
      const response = await fetch(`${API_URL}/content?saved=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.data.content;
    } catch (error: any) {
      console.error("Saved content fetch error:", error);
      throw new Error(error.message || "Failed to fetch saved content");
    }
  }
};

export default contentAPI;
