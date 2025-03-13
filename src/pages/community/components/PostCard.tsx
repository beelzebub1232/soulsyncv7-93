
import { MessageSquare, Heart, Flag, Shield, MoreHorizontal } from "lucide-react";
import { ForumPost } from "@/types/community";
import { UserData } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "../utils/dateUtils";

interface PostCardProps {
  post: ForumPost;
  onClick: () => void;
  currentUser: UserData | null;
}

export function PostCard({ post, onClick, currentUser }: PostCardProps) {
  const isAuthor = currentUser && post.authorId === currentUser.id;
  const showAuthorInfo = !post.isAnonymous || isAuthor || currentUser?.role === 'admin';
  
  const displayAuthor = () => {
    if (post.isAnonymous && !isAuthor && currentUser?.role !== 'admin') {
      return 'Anonymous';
    }
    
    if (isAuthor) {
      return `${post.author} (you)`;
    }
    
    return post.author;
  };
  
  return (
    <div 
      onClick={onClick}
      className="card-primary block hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium">{post.title}</h3>
        
        {post.isReported && (currentUser?.role === 'admin' || currentUser?.role === 'professional') && (
          <Badge variant="destructive" className="ml-2">Reported</Badge>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {post.content}
      </p>
      
      {post.media && post.media.length > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {post.media.length} media {post.media.length === 1 ? 'file' : 'files'}
          </Badge>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3 text-xs">
        <span className="text-mindscape-primary">{post.categoryName}</span>
        <div className="text-muted-foreground flex items-center gap-1">
          <span>{displayAuthor()}</span>
          {post.authorRole === 'professional' && !post.isAnonymous && (
            <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4">
              <Shield className="h-2.5 w-2.5 mr-0.5" /> Pro
            </Badge>
          )}
          <span>·</span>
          <span>{formatRelativeTime(post.date)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={(e) => e.stopPropagation()}>
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.replies}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={(e) => e.stopPropagation()}>
            <Heart className="h-3.5 w-3.5" />
            <span>{post.likes}</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {!isAuthor && (currentUser?.role === 'user' || currentUser?.role === 'professional') && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={(e) => {
              e.stopPropagation();
              // Report handling would go here
            }}>
              <Flag className="h-3.5 w-3.5" />
            </Button>
          )}
          
          {(isAuthor || currentUser?.role === 'admin') && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={(e) => {
              e.stopPropagation();
              // Post actions menu would go here
            }}>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
