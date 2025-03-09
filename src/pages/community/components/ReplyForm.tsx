
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ReplyFormProps {
  replyContent: string;
  setReplyContent: (content: string) => void;
  isAnonymous: boolean;
  setIsAnonymous: (anonymous: boolean) => void;
  onSubmit: () => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  replyContent,
  setReplyContent,
  isAnonymous,
  setIsAnonymous,
  onSubmit
}) => {
  return (
    <Card className="border-mindscape-light mt-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Add Your Reply</h3>
        
        <Textarea
          placeholder="Share your thoughts..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="min-h-[120px] border-mindscape-light focus:border-mindscape-primary"
        />
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous" 
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            />
            <label 
              htmlFor="anonymous" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Post anonymously
            </label>
          </div>
          
          <Button 
            onClick={onSubmit}
            className="button-primary"
          >
            Submit Reply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
