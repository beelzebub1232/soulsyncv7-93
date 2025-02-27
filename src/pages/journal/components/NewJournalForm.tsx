
import { useState } from "react";
import { Camera, Link2, Mic, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MoodTracker } from "@/pages/home/components/MoodTracker";

interface NewJournalFormProps {
  onComplete: () => void;
}

export function NewJournalForm({ onComplete }: NewJournalFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please add both a title and content to your journal",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate saving the journal entry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Journal entry saved",
        description: "Your thoughts have been recorded successfully.",
      });
      
      onComplete();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: "There was an error saving your journal entry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <Input
          placeholder="Title your entry"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium border-none focus:ring-0 p-0 h-auto"
        />
        
        <Textarea
          placeholder="What's on your mind today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] resize-none border-none focus:ring-0 p-0"
        />
      </div>
      
      <div className="border-t border-border pt-4">
        <h3 className="font-medium mb-3">How are you feeling?</h3>
        <MoodTracker />
      </div>
      
      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" className="flex items-center gap-1">
          <Camera className="h-4 w-4" />
          <span>Photo</span>
        </Button>
        <Button type="button" variant="outline" className="flex items-center gap-1">
          <Mic className="h-4 w-4" />
          <span>Audio</span>
        </Button>
        <Button type="button" variant="outline" className="flex items-center gap-1">
          <Link2 className="h-4 w-4" />
          <span>Link</span>
        </Button>
        <Button type="button" variant="outline" className="flex items-center gap-1">
          <Smile className="h-4 w-4" />
          <span>Feeling</span>
        </Button>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onComplete}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}
