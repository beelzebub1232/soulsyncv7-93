
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { ForumCategory, ForumPost } from "@/types/community";
import { UserData } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Link2, Trash2, X } from "lucide-react";

interface NewPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: ForumPost) => void;
  categories: ForumCategory[];
  currentUser: UserData | null;
}

export function NewPostDialog({ isOpen, onClose, onCreatePost, categories, currentUser }: NewPostDialogProps) {
  const { toast } = useToast();
  
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryId: "",
    isAnonymous: false,
    media: [] as { type: 'image' | 'video'; url: string }[]
  });
  
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  const resetForm = () => {
    setNewPost({
      title: "",
      content: "",
      categoryId: "",
      isAnonymous: false,
      media: []
    });
    setMediaUrl("");
    setMediaType('image');
  };
  
  const handleAddMedia = () => {
    if (!mediaUrl.trim()) return;
    
    setNewPost({
      ...newPost,
      media: [...newPost.media, { type: mediaType, url: mediaUrl }]
    });
    
    setMediaUrl("");
  };
  
  const handleRemoveMedia = (index: number) => {
    setNewPost({
      ...newPost,
      media: newPost.media.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = () => {
    if (!newPost.title || !newPost.content || !newPost.categoryId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a post."
      });
      return;
    }
    
    const category = categories.find(c => c.id === newPost.categoryId);
    if (!category) return;
    
    const post: ForumPost = {
      id: crypto.randomUUID(),
      title: newPost.title,
      content: newPost.content,
      categoryId: newPost.categoryId,
      categoryName: category.name,
      author: currentUser.username,
      authorId: currentUser.id,
      authorRole: currentUser.role,
      date: new Date(),
      replies: 0,
      likes: 0,
      isAnonymous: newPost.isAnonymous,
      isReported: false,
      media: newPost.media.length > 0 ? newPost.media : undefined
    };
    
    onCreatePost(post);
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start a Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="What would you like to discuss?"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              placeholder="Share your thoughts, questions or experiences..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              className="min-h-[150px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="post-category">Category</Label>
            <Select 
              value={newPost.categoryId}
              onValueChange={(value) => setNewPost({...newPost, categoryId: value})}
            >
              <SelectTrigger id="post-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Media Section */}
          <div className="space-y-2">
            <Label>Add Media (Optional)</Label>
            <div className="flex space-x-2">
              <Select 
                value={mediaType}
                onValueChange={(value) => setMediaType(value as 'image' | 'video')}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={mediaType === 'image' ? "Image URL" : "Video URL"}
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddMedia}
                size="icon"
              >
                {mediaType === 'image' ? <ImagePlus className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              </Button>
            </div>
            
            {newPost.media.length > 0 && (
              <div className="mt-2 space-y-2">
                {newPost.media.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <span className="text-xs truncate flex-1">
                      {item.type === 'image' ? '🖼️' : '🎬'} {item.url}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-mode"
              checked={newPost.isAnonymous}
              onCheckedChange={(checked) => setNewPost({...newPost, isAnonymous: checked})}
            />
            <Label htmlFor="anonymous-mode">Post anonymously</Label>
          </div>
          
          {currentUser?.role === 'professional' && (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md text-sm">
              <p>As a professional, your posts will display a verified badge unless posted anonymously.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="button-primary">
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
