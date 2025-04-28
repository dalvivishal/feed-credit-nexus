
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { adminService, ContentItem, authService } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminReports = () => {
  const [flaggedContent, setFlaggedContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const isAuthorized = authService.isModerator();
  
  useEffect(() => {
    if (!isAuthorized) {
      toast.error("You don't have permission to access this page");
      navigate('/');
      return;
    }
    
    const fetchFlaggedContent = async () => {
      setLoading(true);
      try {
        const data = await adminService.getFlaggedContent();
        setFlaggedContent(data);
      } catch (error) {
        console.error('Error fetching flagged content:', error);
        toast.error('Failed to load flagged content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlaggedContent();
  }, [navigate, isAuthorized]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  const handleApprove = async (contentId: string) => {
    try {
      await adminService.resolveFlag(contentId, 'approve');
      setFlaggedContent(prevContent => 
        prevContent.filter(item => item.id !== contentId)
      );
      toast.success('Content has been approved and flag resolved');
      setViewDialogOpen(false);
    } catch (error) {
      toast.error('Failed to approve content');
    }
  };
  
  const handleRemove = async (contentId: string) => {
    try {
      await adminService.resolveFlag(contentId, 'remove');
      setFlaggedContent(prevContent => 
        prevContent.filter(item => item.id !== contentId)
      );
      toast.success('Content has been removed');
      setViewDialogOpen(false);
    } catch (error) {
      toast.error('Failed to remove content');
    }
  };
  
  const viewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setViewDialogOpen(true);
  };
  
  if (!isAuthorized) {
    return null; // Already handled in useEffect with redirect
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Flags</h1>
        <p className="text-muted-foreground mt-2">
          Review and moderate content flagged by users
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Flagged Content</CardTitle>
          <CardDescription>
            Content that has been reported by users for review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : flaggedContent.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">{content.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {content.source.charAt(0).toUpperCase() + content.source.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(content.timestamp)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewContent(content)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <CheckCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">All Clear!</h3>
              <p className="text-muted-foreground mt-2">
                There is no flagged content to review at this time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Content Review Dialog */}
      {selectedContent && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Review Flagged Content</DialogTitle>
              <DialogDescription>
                Review the content and take appropriate action
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedContent.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={selectedContent.imageUrl}
                    alt={selectedContent.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-bold">{selectedContent.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  {selectedContent.source.charAt(0).toUpperCase() + selectedContent.source.slice(1)}
                </Badge>
                <span>•</span>
                <span>By {selectedContent.author}</span>
                <span>•</span>
                <span>{formatDate(selectedContent.timestamp)}</span>
              </div>
              <p className="mt-2">{selectedContent.description}</p>
              <div className="flex gap-2 mt-2">
                {selectedContent.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => handleApprove(selectedContent.id)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve Content
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleRemove(selectedContent.id)}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Remove Content
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminReports;
