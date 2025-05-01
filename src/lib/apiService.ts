// Import all service modules
import authAPI from '@/lib/services/authService';
import contentAPI from '@/lib/services/contentService';
import creditsAPI from '@/lib/services/creditsService';
import adminAPI from '@/lib/services/adminService';

// Create a single export for all API functions
const api = {
  auth: authAPI,
  content: contentAPI,
  credits: creditsAPI,
  admin: adminAPI,
};

export default api;