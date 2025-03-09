
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ForumCategory } from "@/types/community";

interface CreatePostDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categoryName: string;
  newPost: {
    title: string;
    content: string;
    isAnonymous: boolean;
  };
  setNewPost: (post: {
    title: string;
    content: string;
    isAnonymous: boolean;
  }) => void;
  onCreatePost: () => void;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  isOpen,
  setIsOpen,
  categoryName,
  newPost,
  setNewPost,
  onCreatePost
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post in {categoryName}</DialogTitle>
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
          
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-mode"
              checked={newPost.isAnonymous}
              onCheckedChange={(checked) => setNewPost({...newPost, isAnonymous: checked})}
            />
            <Label htmlFor="anonymous-mode">Post anonymously</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onCreatePost} className="button-primary">
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
