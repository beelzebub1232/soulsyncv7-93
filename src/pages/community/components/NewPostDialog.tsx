
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ForumCategory } from "@/types/community";

interface NewPostFormData {
  title: string;
  content: string;
  categoryId: string;
  isAnonymous: boolean;
}

interface NewPostDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: NewPostFormData;
  setFormData: (data: NewPostFormData) => void;
  categories: ForumCategory[];
  onSubmit: () => void;
}

export const NewPostDialog: React.FC<NewPostDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  formData, 
  setFormData, 
  categories, 
  onSubmit 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              placeholder="Share your thoughts, questions or experiences..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="min-h-[150px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="post-category">Category</Label>
            <Select 
              value={formData.categoryId}
              onValueChange={(value) => setFormData({...formData, categoryId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-mode"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) => setFormData({...formData, isAnonymous: checked})}
            />
            <Label htmlFor="anonymous-mode">Post anonymously</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="button-primary">
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
