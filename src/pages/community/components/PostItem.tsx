
import { ForumPost } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Calendar, CheckCircle2, Youtube, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface PostItemProps {
  post: ForumPost;
  onLike?: (postId: string) => void;
  isLiked?: boolean;
}

export function PostItem({ post, onLike, isLiked = false }: PostItemProps) {
  const { user } = useUser();
  const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    if (onLike) {
      onLike(post.id);
    }
  };
  
  // Function to check if a link is from YouTube
  const isYouTubeLink = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };
  
  // Get the correct media preview text
  const getMediaPreviewText = () => {
    if (post.images && post.images.length > 0) {
      return post.videoLinks && post.videoLinks.length > 0 
        ? "Has images and links" 
        : "Has images";
    } else if (post.videoLinks && post.videoLinks.length > 0) {
      // Check if any of the links are YouTube
      const hasYouTube = post.videoLinks.some(link => isYouTubeLink(link));
      const hasOtherLinks = post.videoLinks.some(link => !isYouTubeLink(link));
      
      if (hasYouTube && hasOtherLinks) {
        return "Has videos and links";
      } else if (hasYouTube) {
        return "Has video content";
      } else {
        return "Has links";
      }
    }
    
    return null;
  };

  return (
    <Link 
      to={`/community/post/${post.id}`}
      className="block card-primary p-3 sm:p-4 hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <h3 className="font-medium text-sm sm:text-base line-clamp-2">
          {post.title}
          {post.isEdited && <span className="text-xs text-muted-foreground ml-1">(edited)</span>}
        </h3>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} transition-colors`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
            <span>{post.likes}</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.replies}</span>
          </div>
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
        {post.content}
      </p>
      
      {post.images && post.images.length > 0 && (
        <div className="mt-2 flex gap-1 overflow-x-auto">
          {post.images.map((img, idx) => (
            <div key={idx} className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
              <img src={img} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
      
      {getMediaPreviewText() && (
        <div className="mt-2 text-xs text-blue-500">
          <span className="flex items-center gap-1">
            {post.videoLinks && post.videoLinks.some(link => isYouTubeLink(link)) && (
              <Youtube className="h-3 w-3" />
            )}
            {post.videoLinks && post.videoLinks.some(link => !isYouTubeLink(link)) && (
              <Link2 className="h-3 w-3" />
            )}
            <span>{getMediaPreviewText()}</span>
          </span>
        </div>
      )}
      
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
