
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

// Credits API calls
export const creditsAPI = {
  getBalance: async () => {
    try {
      const response = await fetch(`${API_URL}/credits/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data.data.credits;
    } catch (error: any) {
      console.error("Credits balance error:", error);
      throw new Error(error.message || "Failed to fetch credits");
    }
  },

  spendCredits: async (amount: number, feature: string) => {
    try {
      const response = await fetch(`${API_URL}/credits/spend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, feature }),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (error: any) {
      console.error("Credits spend error:", error);
      throw new Error(error.message || "Failed to spend credits");
    }
  },

  claimDailyBonus: async () => {
    try {
      const response = await fetch(`${API_URL}/credits/claim-daily`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      toast.success(`Daily bonus claimed! +${data.data.bonusAmount} credits`);
      return data.data;
    } catch (error: any) {
      console.error("Daily bonus claim error:", error);
      throw new Error(error.message || "Failed to claim daily bonus");
    }
  },

  getTransactionHistory: async (page = 1, limit = 10, type?: string) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (type) {
        queryParams.append('type', type);
      }

      const response = await fetch(`${API_URL}/credits/transactions?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data;
    } catch (error: any) {
      console.error("Transaction history error:", error);
      throw new Error(error.message || "Failed to fetch transaction history");
    }
  }
};

export default creditsAPI;
