
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { contentService, ContentItem, authService } from '@/lib/api';
import ContentCard from '@/components/ContentCard';
import { Loader2, User, Coins, Calendar, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [savedContent, setSavedContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();
  
  useEffect(() => {
    const fetchSavedContent = async () => {
      setLoading(true);
      try {
        const data = await contentService.getSavedContent();
        setSavedContent(data);
      } catch (error) {
        console.error('Error fetching saved content:', error);
        toast.error('Failed to load saved content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedContent();
  }, []);
  
  const handleContentUpdate = (updatedItem: ContentItem) => {
    if (!updatedItem.saved) {
      // Remove from saved content if now unsaved
      setSavedContent(prevContent => 
        prevContent.filter(item => item.id !== updatedItem.id)
      );
    } else {
      setSavedContent(prevContent => 
        prevContent.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>You need to be logged in to view this page.</p>
          <Button className="mt-4" asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and view your saved content
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.username}</CardTitle>
              <Badge variant={user.role === 'admin' ? 'default' : user.role === 'moderator' ? 'secondary' : 'outline'}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-2 text-yellow-600" />
                  <span>{user.credits} credits available</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {user.joined}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Edit Profile</Button>
            </CardFooter>
          </Card>
          
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>Your activity on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Content Saved</span>
                  <Badge variant="outline">{savedContent.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Content Shared</span>
                  <Badge variant="outline">7</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Credits Earned</span>
                  <Badge variant="outline">230</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Credits Spent</span>
                  <Badge variant="outline">75</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>My Content</CardTitle>
              <CardDescription>Manage your saved and shared content</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="saved">
                <TabsList className="mb-4">
                  <TabsTrigger value="saved">Saved ({savedContent.length})</TabsTrigger>
                  <TabsTrigger value="shared">Shared (7)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="saved">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : savedContent.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedContent.map((item) => (
                        <ContentCard key={item.id} item={item} onUpdate={handleContentUpdate} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No saved content</h3>
                      <p className="text-muted-foreground mt-2">
                        When you save content, it will appear here.
                      </p>
                      <Button className="mt-4" asChild>
                        <a href="/">Discover Content</a>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="shared">
                  {/* For demo purposes, just showing a placeholder */}
                  <div className="text-center py-12">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-muted-foreground mt-2">
                      Sharing tracking is being implemented.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
