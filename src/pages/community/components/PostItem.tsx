
import { ForumPost } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Calendar, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PostItemProps {
  post: ForumPost;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <Link 
      to={`/community/post/${post.id}`}
      className="block card-primary p-4 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{post.title}</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="h-3.5 w-3.5" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.replies}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {post.content}
      </p>
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-1">
          {post.isAnonymous ? (
            <span className="text-xs text-muted-foreground">Anonymous</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-xs font-medium",
                post.authorRole === "professional" ? "text-blue-600" : "text-muted-foreground"
              )}>
                {post.author}
              </span>
              {post.authorRole === "professional" && (
                <CheckCircle2 className="h-3 w-3 text-blue-600 fill-blue-600" />
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDistanceToNow(post.date, { addSuffix: true })}</span>
        </div>
      </div>
    </Link>
  );
}
