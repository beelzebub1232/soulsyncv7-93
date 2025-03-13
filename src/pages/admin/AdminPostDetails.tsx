
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageSquare, MoreVertical, Trash, Flag, User } from "lucide-react";
import { ForumPost, ForumReply, Report } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AdminReplyItem } from "./components/AdminReplyItem";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminPostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (!postId) return;
    
    // Find post from all categories
    const savedCategories = localStorage.getItem('soulsync_forum_categories');
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      
      for (const category of categories) {
        const savedPosts = localStorage.getItem(`soulsync_posts_${category.id}`);
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          const foundPost = parsedPosts.find((p: any) => p.id === postId);
          
          if (foundPost) {
            // Convert date to Date object
            setPost({
              ...foundPost,
              date: new Date(foundPost.date),
              lastEditedDate: foundPost.lastEditedDate ? new Date(foundPost.lastEditedDate) : undefined
            });
            break;
          }
        }
      }
    }
    
    // Load replies for this post
    const savedReplies = localStorage.getItem(`soulsync_replies_${postId}`);
    if (savedReplies) {
      try {
        const parsedReplies = JSON.parse(savedReplies);
        // Convert date strings to Date objects
        const processedReplies = parsedReplies.map((reply: any) => ({
          ...reply,
          date: new Date(reply.date),
          lastEditedDate: reply.lastEditedDate ? new Date(reply.lastEditedDate) : undefined
        }));
        // Sort by date (oldest first)
        processedReplies.sort((a: ForumReply, b: ForumReply) => a.date.getTime() - b.date.getTime());
        setReplies(processedReplies);
      } catch (error) {
        console.error('Failed to parse replies:', error);
        setReplies([]);
      }
    } else {
      setReplies([]);
    }
  }, [postId]);

  const handleDeletePost = () => {
    if (!post || !postId) return;
    
    // Delete post from its category
    const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      const updatedPosts = parsedPosts.filter((p: any) => p.id !== postId);
      localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
      
      // Update category post count
      const savedCategories = localStorage.getItem('soulsync_forum_categories');
      if (savedCategories) {
        const categories = JSON.parse(savedCategories);
        const updatedCategories = categories.map((c: any) => 
          c.id === post.categoryId ? {...c, posts: updatedPosts.length} : c
        );
        localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
      }
    }
    
    // Delete all replies
    localStorage.removeItem(`soulsync_replies_${postId}`);
    
    toast({
      title: "Post deleted",
      description: "The post and all its replies have been deleted.",
    });
    
    // Navigate back to the category
    navigate(`/admin/community/category/${post.categoryId}`);
  };

  const handleDeleteReply = (replyId: string) => {
    if (!postId) return;
    
    // Update replies state
    const updatedReplies = replies.filter(reply => reply.id !== replyId);
    setReplies(updatedReplies);
    
    // Update localStorage
    localStorage.setItem(`soulsync_replies_${postId}`, JSON.stringify(updatedReplies));
    
    // Update post reply count
    if (post) {
      const updatedPost = {...post, replies: updatedReplies.length};
      setPost(updatedPost);
      
      // Update post in category
      const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        const updatedPosts = parsedPosts.map((p: any) => 
          p.id === postId ? {...p, replies: updatedReplies.length} : p
        );
        localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
      }
    }
    
    toast({
      title: "Reply deleted",
      description: "The reply has been successfully deleted.",
    });
  };

  const handleReplyToPost = () => {
    if (!post || !postId || !replyContent.trim()) return;
    
    // Create a new reply
    const newReply: ForumReply = {
      id: crypto.randomUUID(),
      postId: postId,
      content: replyContent,
      author: 'Admin',
      authorId: 'admin-1',
      authorRole: 'admin',
      date: new Date(),
      likes: 0,
      isAnonymous: false
    };
    
    // Update state
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    
    // Update localStorage
    localStorage.setItem(`soulsync_replies_${postId}`, JSON.stringify(updatedReplies));
    
    // Update post reply count
    const updatedPost = {...post, replies: updatedReplies.length};
    setPost(updatedPost);
    
    // Update post in category
    const savedPosts = localStorage.getItem(`soulsync_posts_${post.categoryId}`);
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      const updatedPosts = parsedPosts.map((p: any) => 
        p.id === postId ? {...p, replies: updatedReplies.length} : p
      );
      localStorage.setItem(`soulsync_posts_${post.categoryId}`, JSON.stringify(updatedPosts));
    }
    
    // Reset input
    setReplyContent("");
    
    toast({
      title: "Reply added",
      description: "Your reply has been posted.",
    });
  };

  const handleReportPost = () => {
    if (!post) return;
    
    // Create a new report
    const newReport: Report = {
      id: crypto.randomUUID(),
      contentId: post.id,
      contentType: 'post',
      reportedBy: 'admin-1',
      reason: 'Flagged by admin for review',
      date: new Date(),
      status: 'pending'
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

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)]">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Post not found</h3>
        <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
        <Link to="/admin/community">
          <Button>Go to Community</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <Link to={`/admin/community/category/${post.categoryId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to {post.categoryName}
      </Link>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-start">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {post.isAnonymous ? <User className="h-4 w-4" /> : post.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold mb-1">{post.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <div className="text-sm text-muted-foreground">
                    By {post.isAnonymous ? 'Anonymous' : post.author}
                    {post.authorRole === 'professional' && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-[10px] py-0 h-4">
                        Professional
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">•</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(post.date, { addSuffix: true })}
                  </div>
                  {post.isEdited && (
                    <>
                      <div className="text-sm text-muted-foreground">•</div>
                      <div className="text-sm text-muted-foreground">Edited</div>
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
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)} 
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 text-sm">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1 text-sm">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>{post.replies} replies</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Replies</h2>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {replies.length > 0 ? (
              <div className="divide-y">
                {replies.map((reply) => (
                  <AdminReplyItem 
                    key={reply.id} 
                    reply={reply} 
                    onDelete={() => handleDeleteReply(reply.id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No replies yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
        <div className="container flex gap-3 items-center max-w-4xl">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="Add a reply as Admin..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button 
            onClick={handleReplyToPost}
            disabled={!replyContent.trim()}
          >
            Reply
          </Button>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone and all replies will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
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
