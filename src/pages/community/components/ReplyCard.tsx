
import React from 'react';
import { ThumbsUp, Clock } from 'lucide-react';
import { ForumReply } from "@/types/community";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelativeTime } from '../utils/formatters';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReplyCardProps {
  reply: ForumReply;
  onLike?: (replyId: string) => void;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({ reply, onLike }) => {
  return (
    <Card className="border-mindscape-light">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {reply.isAnonymous ? (
              <>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">?</span>
                </div>
                <span className="font-medium">Anonymous</span>
              </>
            ) : (
              <>
                <Avatar>
                  <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{reply.author}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatRelativeTime(reply.date)}</span>
          </div>
        </div>
        
        <div className="mt-3 text-sm">
          {reply.content}
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onLike && onLike(reply.id)}
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-mindscape-primary"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{reply.likes}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
