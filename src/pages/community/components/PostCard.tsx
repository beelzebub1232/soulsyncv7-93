
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ForumPost } from "@/types/community";
import { formatRelativeTime } from '../utils/formatters';

interface PostCardProps {
  post: ForumPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card 
      className="hover:shadow-md transition-all"
    >
      <CardContent className="p-4">
        <Link to={`/community/post/${post.id}`}>
          <h3 className="font-medium hover:text-mindscape-primary transition-colors">{post.title}</h3>
        </Link>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {post.content}
        </p>
        
        <div className="flex justify-between items-center mt-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-mindscape-primary border border-mindscape-light rounded-full px-2 py-0.5">
              {post.categoryName}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              {post.replies} replies
            </span>
          </div>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatRelativeTime(post.date)}
          </span>
        </div>
        
        <div className="mt-2 flex items-center text-xs">
          <div className="flex items-center gap-2">
            {post.isAnonymous ? (
              <>
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <span className="text-xs">?</span>
                </div>
                <span className="text-muted-foreground">Anonymous</span>
              </>
            ) : (
              <>
                <Avatar className="w-6 h-6">
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{post.author}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
