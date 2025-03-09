
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ForumPost } from "@/types/community";
import { formatRelativeTime } from '../utils/formatters';

interface PostDetailProps {
  post: ForumPost;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-6">
        <Link to="/community" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Forums
        </Link>
        
        <Card className="border-mindscape-light">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {post.isAnonymous ? (
                  <>
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <span className="text-lg">?</span>
                    </div>
                    <div>
                      <p className="font-medium">Anonymous</p>
                      <p className="text-xs text-mindscape-primary">{post.categoryName}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar className="w-9 h-9">
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author}</p>
                      <p className="text-xs text-mindscape-primary">{post.categoryName}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatRelativeTime(post.date)}</span>
              </div>
            </div>
            
            <h1 className="text-xl font-semibold mt-4">{post.title}</h1>
            
            <div className="mt-3 whitespace-pre-wrap text-sm">
              {post.content}
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground border-t pt-4">
              <MessageSquare className="h-4 w-4" />
              <span>{post.replies} replies</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
