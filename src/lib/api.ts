
import { toast } from "sonner";

// Mock user data
interface User {
  id: string;
  username: string;
  email: string;
  credits: number;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  joined: string;
}

// Mock content data
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

// Mock users
const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    credits: 450,
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=1',
    joined: '2023-01-15'
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    credits: 1250,
    role: 'moderator',
    avatar: 'https://i.pravatar.cc/150?u=2',
    joined: '2022-11-05'
  },
  {
    id: '3',
    username: 'admin',
    email: 'admin@example.com',
    credits: 9999,
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=3',
    joined: '2022-01-01'
  }
];

// Mock content items
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Education',
    description: 'A deep dive into how AI is transforming educational systems worldwide and creating new opportunities for personalized learning.',
    source: 'linkedin',
    author: 'Tech Education Network',
    timestamp: '2025-04-25T14:30:00',
    imageUrl: 'https://source.unsplash.com/random/800x600/?ai,education',
    url: '#content-1',
    tags: ['AI', 'Education', 'Technology'],
    likes: 342,
    saved: false,
    flagged: false
  },
  {
    id: '2',
    title: 'Latest Research on Sustainable Energy Solutions',
    description: 'Researchers have discovered a new method to improve solar panel efficiency by 30%, paving the way for more affordable clean energy.',
    source: 'reddit',
    author: 'r/RenewableEnergy',
    timestamp: '2025-04-26T09:15:00',
    imageUrl: 'https://source.unsplash.com/random/800x600/?solar,energy',
    url: '#content-2',
    tags: ['Science', 'Renewable Energy', 'Research'],
    likes: 189,
    saved: false,
    flagged: false
  },
  {
    id: '3',
    title: 'New Programming Language Gains Popularity Among Developers',
    description: 'The rise of a new programming language that promises to combine performance with ease of use has caught the attention of developers worldwide.',
    source: 'twitter',
    author: 'CodeWeekly',
    timestamp: '2025-04-27T11:45:00',
    imageUrl: 'https://source.unsplash.com/random/800x600/?code,programming',
    url: '#content-3',
    tags: ['Programming', 'Technology', 'Development'],
    likes: 275,
    saved: false,
    flagged: false
  },
  {
    id: '4',
    title: 'Understanding Blockchain Beyond Cryptocurrency',
    description: 'Exploring practical applications of blockchain technology in supply chain management, healthcare, and voting systems.',
    source: 'linkedin',
    author: 'Blockchain Innovators',
    timestamp: '2025-04-24T16:20:00',
    imageUrl: 'https://source.unsplash.com/random/800x600/?blockchain',
    url: '#content-4',
    tags: ['Blockchain', 'Technology', 'Innovation'],
    likes: 156,
    saved: false,
    flagged: false
  },
  {
    id: '5',
    title: 'The Science of Learning: How to Study More Effectively',
    description: 'Recent cognitive science research reveals optimal study techniques that can significantly improve information retention and understanding.',
    source: 'reddit',
    author: 'r/LearningScience',
    timestamp: '2025-04-23T13:10:00',
    imageUrl: 'https://source.unsplash.com/random/800x600/?study,learning',
    url: '#content-5',
    tags: ['Learning', 'Psychology', 'Education'],
    likes: 421,
    saved: false,
    flagged: false
  },
  {
    id: '6',
    title: 'Top Machine Learning Frameworks Comparison for 2025',
    description: 'An in-depth analysis of the most popular machine learning frameworks, their strengths, weaknesses, and ideal use cases.',
    source: 'twitter',
    author: 'AI Enthusiast',
    timestamp: '2025-04-22T10:05:00',
    imageUrl: 'https://source.unsplash.com/random/800x600/?machine,learning',
    url: '#content-6',
    tags: ['Machine Learning', 'AI', 'Programming'],
    likes: 309,
    saved: false,
    flagged: false
  }
];

// Mock credit transactions
const mockTransactions: CreditTransaction[] = [
  {
    id: '1',
    userId: '1',
    amount: 10,
    type: 'earned',
    reason: 'Watched educational content',
    timestamp: '2025-04-27T14:30:00'
  },
  {
    id: '2',
    userId: '1',
    amount: 5,
    type: 'earned',
    reason: 'Shared content with community',
    timestamp: '2025-04-26T10:15:00'
  },
  {
    id: '3',
    userId: '1',
    amount: 25,
    type: 'spent',
    reason: 'Unlocked premium course',
    timestamp: '2025-04-25T16:45:00'
  },
  {
    id: '4',
    userId: '1',
    amount: 15,
    type: 'earned',
    reason: 'Community contribution - helpful comment',
    timestamp: '2025-04-24T09:30:00'
  },
  {
    id: '5',
    userId: '1',
    amount: 50,
    type: 'spent',
    reason: 'Virtual event registration',
    timestamp: '2025-04-20T11:20:00'
  }
];

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock auth service
let currentUser: User | null = null;

export const authService = {
  login: async (email: string, password: string) => {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') { // In a real app, password would be hashed
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token');
      return { success: true, user };
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (username: string, email: string, password: string) => {
    await delay(1000);
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      username,
      email,
      credits: 100, // Starting credits
      role: 'user',
      avatar: `https://i.pravatar.cc/150?u=${mockUsers.length + 1}`,
      joined: new Date().toISOString().split('T')[0]
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'mock-jwt-token');
    return { success: true, user: newUser };
  },
  
  logout: async () => {
    await delay(500);
    currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { success: true };
  },
  
  getCurrentUser: () => {
    if (currentUser) return currentUser;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!authService.getCurrentUser();
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
  
  isModerator: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'moderator' || user?.role === 'admin';
  }
};

// Content service
export const contentService = {
  getContent: async (filter?: string) => {
    await delay(800);
    let filteredContent = [...mockContent];
    
    if (filter) {
      filteredContent = filteredContent.filter(item => 
        item.source === filter || 
        item.tags.includes(filter)
      );
    }
    
    return filteredContent;
  },
  
  saveContent: async (contentId: string) => {
    await delay(500);
    const index = mockContent.findIndex(item => item.id === contentId);
    if (index !== -1) {
      mockContent[index].saved = !mockContent[index].saved;
      
      // Award credits if saving (not unsaving)
      if (mockContent[index].saved) {
        const user = authService.getCurrentUser();
        if (user) {
          user.credits += 5;
          const transaction: CreditTransaction = {
            id: (mockTransactions.length + 1).toString(),
            userId: user.id,
            amount: 5,
            type: 'earned',
            reason: 'Saved content for later',
            timestamp: new Date().toISOString()
          };
          mockTransactions.push(transaction);
        }
      }
      
      return mockContent[index];
    }
    throw new Error('Content not found');
  },
  
  flagContent: async (contentId: string, reason: string) => {
    await delay(500);
    const index = mockContent.findIndex(item => item.id === contentId);
    if (index !== -1) {
      mockContent[index].flagged = true;
      toast.success("Content has been reported to moderators");
      return mockContent[index];
    }
    throw new Error('Content not found');
  },
  
  getSavedContent: async () => {
    await delay(800);
    return mockContent.filter(item => item.saved);
  }
};

// Credits service
export const creditService = {
  getUserCredits: async () => {
    await delay(500);
    const user = authService.getCurrentUser();
    return user ? user.credits : 0;
  },
  
  getTransactionHistory: async () => {
    await delay(800);
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    return mockTransactions
      .filter(t => t.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  
  awardCredits: async (amount: number, reason: string) => {
    await delay(500);
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    user.credits += amount;
    const transaction: CreditTransaction = {
      id: (mockTransactions.length + 1).toString(),
      userId: user.id,
      amount,
      type: 'earned',
      reason,
      timestamp: new Date().toISOString()
    };
    mockTransactions.push(transaction);
    
    return { success: true, newBalance: user.credits };
  },
  
  spendCredits: async (amount: number, reason: string) => {
    await delay(500);
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    if (user.credits < amount) {
      throw new Error('Insufficient credits');
    }
    
    user.credits -= amount;
    const transaction: CreditTransaction = {
      id: (mockTransactions.length + 1).toString(),
      userId: user.id,
      amount,
      type: 'spent',
      reason,
      timestamp: new Date().toISOString()
    };
    mockTransactions.push(transaction);
    
    return { success: true, newBalance: user.credits };
  }
};

// Admin service
export const adminService = {
  getFlaggedContent: async () => {
    await delay(800);
    if (!authService.isModerator()) {
      throw new Error('Unauthorized');
    }
    return mockContent.filter(item => item.flagged);
  },
  
  getAllUsers: async () => {
    await delay(800);
    if (!authService.isAdmin()) {
      throw new Error('Unauthorized');
    }
    return mockUsers;
  },
  
  getUserStats: async () => {
    await delay(800);
    if (!authService.isAdmin()) {
      throw new Error('Unauthorized');
    }
    
    const totalUsers = mockUsers.length;
    const activeUsers = totalUsers - 1; // Just for mock data
    const premiumUsers = 2; // Just for mock data
    
    return {
      totalUsers,
      activeUsers,
      premiumUsers,
      topSavedContent: mockContent.sort((a, b) => b.likes - a.likes).slice(0, 5),
      mostActiveUsers: mockUsers.sort((a, b) => b.credits - a.credits).slice(0, 5)
    };
  },
  
  resolveFlag: async (contentId: string, action: 'approve' | 'remove') => {
    await delay(800);
    if (!authService.isModerator()) {
      throw new Error('Unauthorized');
    }
    
    const index = mockContent.findIndex(item => item.id === contentId);
    if (index !== -1) {
      if (action === 'approve') {
        mockContent[index].flagged = false;
        return { success: true, message: 'Content flag resolved and approved' };
      } else {
        mockContent.splice(index, 1);
        return { success: true, message: 'Content removed' };
      }
    }
    throw new Error('Content not found');
  }
};
