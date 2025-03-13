
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, MoreVertical, Trash, Flag } from "lucide-react";
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

interface AdminPostItemProps {
  post: ForumPost;
  onDelete: () => void;
}

export function AdminPostItem({ post, onDelete }: AdminPostItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const getPostExcerpt = (content: string) => {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  };
  
  const getFormattedDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="p-4 hover:bg-muted/30">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-start">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
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
                <div className="text-xs text-muted-foreground">
                  By {post.isAnonymous ? 'Anonymous' : post.author}
                  {post.authorRole === 'professional' && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-[10px] py-0 h-4">
                      Professional
                    </Badge>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
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
