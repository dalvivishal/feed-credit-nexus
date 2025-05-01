
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentCard from '@/components/ContentCard';
import { Loader2 } from 'lucide-react';
import api from '@/lib/apiService';
import { toast } from 'sonner';

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  source: 'twitter' | 'reddit' | 'linkedin';
  createdBy: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
  imageUrl?: string;
  url: string;
  tags: string[];
  likes: number;
  savedBy: string[];
  flags: Array<{ userId: string; reason: string }>;
}

const Home = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const isAuthenticated = api.auth.isAuthenticated();
  const user = api.auth.getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated) {
      // Show landing page for non-authenticated users
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      try {
        const filters: Record<string, string> = {};

        // Add filter if not "all"
        if (filter !== 'all') {
          if (['twitter', 'reddit', 'linkedin'].includes(filter)) {
            filters.source = filter;
          } else {
            filters.tags = filter;
          }
        }

        const data = await api.content.getAllContent(filters);

        // Transform backend data to match our frontend component expectations
        const transformedContent = data.map((item: ContentItem) => ({
          ...item,
          id: item._id, // Map backend _id to frontend id
          author: item.createdBy?.username || 'Unknown',
          timestamp: item.createdAt,
          saved: user ? item.savedBy?.includes(user.id) : false,
          flagged: item.flags?.length > 0
        }));

        setContent(transformedContent);
      } catch (error: any) {
        console.error('Error fetching content:', error);
        toast.error(error.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [filter, isAuthenticated, user?.id]);

  const handleContentUpdate = (updatedItem: any) => {
    setContent(prevContent =>
      prevContent.map(item => item._id === updatedItem._id ? updatedItem : item)
    );
  };

  if (!isAuthenticated) {
    // Landing page for non-authenticated users
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-primary mb-6 animate-fade-in">
            Discover Educational Content
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Join our community hub where you can discover educational content, interact with a curated feed, and earn credit points for engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
            <Button size="lg" onClick={() => navigate('/register')}>
              Join Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Curated Content Feed</h3>
                <p className="text-muted-foreground text-center">
                  Discover quality educational content from Twitter, Reddit, and LinkedIn, all in one place.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Credit Points System</h3>
                <p className="text-muted-foreground text-center">
                  Earn points for watching content, engaging with the feed, or sharing with others.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Community Interaction</h3>
                <p className="text-muted-foreground text-center">
                  Save for later, share with others, and help moderate content within our community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join the learning community?</h2>
          <Button size="lg" onClick={() => navigate('/register')}>
            Get Started Now
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Discover Learning Content</h1>
        <p className="text-muted-foreground mt-2">
          Explore curated educational content from across the web
        </p>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="Programming">Programming</TabsTrigger>
          <TabsTrigger value="Science">Science</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <ContentCard key={item._id} item={item} onUpdate={handleContentUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;