import { getCookie } from "../cookies";

// Common HTTP client utilities for making API requests
const API_URL = import.meta.env.VITE_API_URL || "https://feed-credit-nexus.onrender.com/api";

// Helper to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// Get auth token for requests
export const getAuthHeader = () => {
  const token = getCookie("eduhub_token");
  return token ? `Bearer ${token}` : "";
};

// Base HTTP request methods
export const httpClient = {
  get: async (endpoint: string, params: Record<string, string> = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const queryString = queryParams.toString();
    const url = `${API_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        Authorization: getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, data: any = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  patch: async (endpoint: string, data: any = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: getAuthHeader(),
      },
    });
    return handleResponse(response);
  }
};

export default httpClient;
