
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, MoreVertical, Trash, Flag, Link2, Youtube } from "lucide-react";
import { ForumPost } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CategoryIcon } from "@/components/community/CategoryIcon";
import { cn } from "@/lib/utils";

interface AdminPostItemProps {
  post: ForumPost;
  onDelete: () => void;
}

export function AdminPostItem({ post, onDelete }: AdminPostItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const getPostExcerpt = (content: string) => {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  };
  
  const getFormattedDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReportPost = () => {
    // Create a new report
    const newReport = {
      id: crypto.randomUUID(),
      contentId: post.id,
      contentType: 'post',
      reportedBy: 'admin-1',
      reason: 'Flagged by admin for review',
      date: new Date(),
      status: 'pending',
      content: post.content,
      categoryId: post.categoryId
    };
    
    // Get existing reports
    const savedReports = localStorage.getItem('soulsync_reported_content');
    let reports = [];
    
    if (savedReports) {
      reports = JSON.parse(savedReports);
    }
    
    // Add new report
    reports.push(newReport);
    
    // Save back to localStorage
    localStorage.setItem('soulsync_reported_content', JSON.stringify(reports));
    
    toast({
      title: "Post reported",
      description: "This post has been flagged for review.",
    });
  };

  // Function to check if a link is from YouTube
  const isYouTubeLink = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  return (
    <div className="p-4 hover:bg-muted/30">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-start">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
              <AvatarFallback>{post.author.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Link 
                  to={`/admin/community/post/${post.id}`}
                  className="font-medium hover:underline line-clamp-1"
                >
                  {post.title}
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="text-xs text-muted-foreground flex items-center">
                  By {post.isAnonymous ? 'Anonymous' : post.author}
                  {post.authorRole === 'professional' && (
                    <span className="ml-1 flex items-center">
                      <CategoryIcon categoryId="verified" className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">•</div>
                <div className="text-xs text-muted-foreground">{getFormattedDate(post.date)}</div>
                {post.isEdited && (
                  <>
                    <div className="text-xs text-muted-foreground">•</div>
                    <div className="text-xs text-muted-foreground">Edited</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleReportPost}>
                <Flag className="h-4 w-4 mr-2" />
                Report Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{getPostExcerpt(post.content)}</p>
        </div>
        
        {post.images && post.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {post.images.map((img, idx) => (
              <div key={idx} className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
        
        {post.videoLinks && post.videoLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.videoLinks.map((link, idx) => (
              <div key={idx} className="text-xs flex items-center">
                {isYouTubeLink(link) ? (
                  <span className="flex items-center gap-1 text-red-500">
                    <Youtube className="h-3.5 w-3.5" />
                    <span>YouTube video</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-blue-500">
                    <Link2 className="h-3.5 w-3.5" />
                    <span>Link</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="h-3.5 w-3.5" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{post.replies}</span>
            </div>
          </div>
          
          <Link to={`/admin/community/post/${post.id}`}>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
