
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, Share, Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/apiService';

interface ContentCardProps {
  item: any;
  onUpdate?: (updatedItem: any) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onUpdate }) => {
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get source icon and color
  const getSourceBadge = () => {
    switch (item.source) {
      case 'twitter':
        return { label: 'Twitter', className: 'bg-blue-500 hover:bg-blue-600' };
      case 'reddit':
        return { label: 'Reddit', className: 'bg-orange-500 hover:bg-orange-600' };
      case 'linkedin':
        return { label: 'LinkedIn', className: 'bg-blue-700 hover:bg-blue-800' };
      default:
        return { label: item.source, className: 'bg-gray-500 hover:bg-gray-600' };
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const id = item._id || item.id;

      let updatedItem;
      if (item.saved) {
        updatedItem = await api.content.unsaveContent(id);
        toast.success('Content unsaved');
      } else {
        updatedItem = await api.content.saveContent(id);
        toast.success('Content saved! +5 credits');
      }

      if (onUpdate) {
        // Transform the returned item to match our component's expectations
        const transformedItem = {
          ...updatedItem,
          id: updatedItem._id,
          saved: updatedItem.savedBy?.includes(api.auth.getCurrentUser()?.id),
        };
        onUpdate(transformedItem);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);
      const id = item._id || item.id;
      await api.content.shareContent(id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to share content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlag = async () => {
    if (!flagReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    try {
      setIsLoading(true);
      const id = item._id || item.id;
      await api.content.flagContent(id, flagReason);
      setIsFlagDialogOpen(false);
      setFlagReason('');

      if (onUpdate) {
        // Update the item to show it's flagged
        onUpdate({
          ...item,
          flagged: true
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to report content');
    } finally {
      setIsLoading(false);
    }
  };

  const sourceBadge = getSourceBadge();

  return (
    <>
      <Card className="group overflow-hidden border-border card-hover">
        {item.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <div>
              {item.tags && item.tags.length > 0 && (
                <Badge variant="secondary" className="mb-2">{item.tags[0]}</Badge>
              )}
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center text-sm">
                <Badge variant="outline" className={sourceBadge.className + " text-white"}>
                  {sourceBadge.label}
                </Badge>
                <span className="mx-2">•</span>
                {formatDate(item.timestamp || item.createdAt)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
          <div className="flex items-center mt-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${item.author || item.createdBy?.username}`} />
              <AvatarFallback>{(item.author || item.createdBy?.username || '??').substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">{item.author || item.createdBy?.username}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/30 px-6 py-3">
          <div className="flex justify-between w-full">
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </Button>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${item.saved ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={handleShare}
                disabled={isLoading}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setIsFlagDialogOpen(true)}
                disabled={isLoading}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
            <DialogDescription>
              Please provide a reason why you're reporting this content.
              Our moderators will review this report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this content should be reviewed..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFlag} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCard;