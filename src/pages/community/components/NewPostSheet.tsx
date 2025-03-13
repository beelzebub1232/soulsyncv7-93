
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { ForumPost } from "@/types/community";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/contexts/NotificationContext"; 
import { Image, Link2, Plus, X } from "lucide-react";

interface NewPostSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: ForumPost) => void;
  categoryId: string;
  categoryName: string;
}

export function NewPostSheet({ isOpen, onClose, onSubmit, categoryId, categoryName }: NewPostSheetProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const { addNotification } = useNotification();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(user?.role === "user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState("");
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and content for your post",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const newPost: ForumPost = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        categoryId,
        categoryName,
        author: isAnonymous ? "Anonymous" : (user?.username || "Unknown"),
        authorId: user?.id || "unknown",
        authorRole: user?.role || "user",
        date: new Date(),
        replies: 0,
        isAnonymous,
        likes: 0,
        images: images.length > 0 ? images : undefined,
        videoLinks: videoLinks.length > 0 ? videoLinks : undefined
      };
      
      onSubmit(newPost);
      
      // Notify admin and professionals if it's a new post
      if (user?.role === 'professional') {
        addNotification({
          type: 'post',
          message: `Professional ${user.username} posted in ${categoryName}`,
        });
      }
      
      // Reset form
      setTitle("");
      setContent("");
      setIsAnonymous(user?.role === "user");
      setImages([]);
      setVideoLinks([]);
      setVideoLink("");
      setIsSubmitting(false);
    }, 1000);
  };
  
  const addVideoLink = () => {
    if (videoLink.trim() && !videoLinks.includes(videoLink.trim())) {
      setVideoLinks([...videoLinks, videoLink.trim()]);
      setVideoLink("");
    }
  };
  
  const removeVideoLink = (link: string) => {
    setVideoLinks(videoLinks.filter(vl => vl !== link));
  };
  
  // This is a placeholder - in a real app you'd implement file uploads
  const handleAddImage = () => {
    const mockImageUrl = "/placeholder.svg";
    setImages([...images, mockImageUrl]);
    toast({
      title: "Image added",
      description: "In a real app, this would upload your image",
    });
  };
  
  const removeImage = (imageUrl: string) => {
    setImages(images.filter(img => img !== imageUrl));
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="sm:max-w-md w-[90%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Post</SheetTitle>
          <SheetDescription>
            Post in {categoryName}
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Add Media (Optional)</Label>
            
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-input">
                  <img src={img} alt="Post attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddImage}
                className="w-16 h-16 border border-dashed border-input rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Image className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoLink">Add Video Link</Label>
              <div className="flex gap-2">
                <Input
                  id="videoLink"
                  placeholder="Paste video URL"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addVideoLink}
                  disabled={!videoLink.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {videoLinks.length > 0 && (
                <div className="space-y-2 mt-2">
                  {videoLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-accent/50 p-2 rounded text-sm">
                      <div className="flex items-center">
                        <Link2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span className="truncate max-w-[200px]">{link}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideoLink(link)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {user?.role === "user" && (
            <div className="flex items-center justify-between">
              <Label htmlFor="anonymous" className="cursor-pointer">Post anonymously</Label>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
