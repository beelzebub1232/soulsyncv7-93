
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ForumPost, ForumReply } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Heart, Flag, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();
  const { toast } = useToast();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(user?.role === "user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  
  // Simulate loading post data
  useEffect(() => {
    if (postId) {
      // This would be a real API call in a production app
      const mockPost: ForumPost = {
        id: postId,
        title: "How to handle anxiety during presentations?",
        content: "I struggle with severe anxiety when giving presentations at work. Any tips that have worked for you? I've tried deep breathing and preparation, but I still freeze up when all eyes are on me.",
        categoryId: "anxiety",
        categoryName: "Anxiety Support",
        author: "Anonymous",
        authorId: "user123",
        authorRole: "user",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        replies: 2,
        isAnonymous: true,
        likes: 12
      };
      
      setPost(mockPost);
      
      // Mock replies
      const mockReplies: ForumReply[] = [
        {
          id: "reply1",
          postId: postId,
          content: "I've found that practicing in front of a mirror really helps. Also, arriving early to get comfortable with the space makes a big difference.",
          author: "Anonymous",
          authorId: "user456",
          authorRole: "user",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isAnonymous: true,
          likes: 5
        },
        {
          id: "reply2",
          postId: postId,
          content: "From a professional perspective, anxiety before presentations is completely normal. Try visualization techniques and progressive muscle relaxation. Remember that most of the anxiety is not visible to others, even if it feels overwhelming to you.",
          author: "Dr. Emily Chen",
          authorId: "prof123",
          authorRole: "professional",
          date: new Date(Date.now() - 12 * 60 * 60 * 1000),
          isAnonymous: false,
          likes: 8
        }
      ];
      
      setReplies(mockReplies);
    }
  }, [postId]);
  
  if (!post) {
    return <div>Loading...</div>;
  }
  
  const handleLikePost = () => {
    setPost({
      ...post,
      likes: post.likes + 1
    });
    
    toast({
      title: "Post liked",
      description: "You liked this post",
    });
  };
  
  const handleLikeReply = (replyId: string) => {
    setReplies(replies.map(reply => 
      reply.id === replyId 
        ? { ...reply, likes: reply.likes + 1 }
        : reply
    ));
    
    toast({
      title: "Reply liked",
      description: "You liked this reply",
    });
  };
  
  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "A moderator will review this content soon",
    });
    
    setReportReason("");
  };
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty reply",
        description: "Please enter some content for your reply",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const newReply: ForumReply = {
        id: Date.now().toString(),
        postId: post.id,
        content: replyContent,
        author: isAnonymous ? "Anonymous" : (user?.username || "Unknown"),
        authorId: user?.id || "unknown",
        authorRole: user?.role || "user",
        date: new Date(),
        isAnonymous,
        likes: 0
      };
      
      setReplies([...replies, newReply]);
      setReplyContent("");
      setIsSubmitting(false);
      
      // Update post reply count
      setPost({
        ...post,
        replies: post.replies + 1
      });
      
      toast({
        title: "Reply posted",
        description: "Your reply has been added to the discussion",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <Link to={`/community/category/${post.categoryId}`} className="flex items-center text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to {post.categoryName}
      </Link>
      
      <div className="card-primary p-5 space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-medium">{post.title}</h1>
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
              onClick={handleLikePost}
            >
              <Heart className="h-5 w-5" />
              <span>{post.likes}</span>
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <Flag className="h-5 w-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Report this post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please select a reason for reporting this post. A moderator will review it soon.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <Select onValueChange={setReportReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                    <SelectItem value="offensive">Offensive language</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="harmful">Harmful content</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleReport}
                    disabled={!reportReason}
                  >
                    Submit Report
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="bg-accent/50 p-4 rounded-lg">
          <p className="whitespace-pre-line">{post.content}</p>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            {post.isAnonymous ? (
              <span className="text-muted-foreground">Anonymous</span>
            ) : (
              <div className="flex items-center gap-1">
                <span className={cn(
                  post.authorRole === "professional" ? "text-blue-600 font-medium" : "text-muted-foreground"
                )}>
                  {post.author}
                </span>
                {post.authorRole === "professional" && (
                  <CheckCircle2 className="h-4 w-4 text-blue-600 fill-blue-600" />
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(post.date, { addSuffix: true })}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Replies ({replies.length})</h2>
        
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="card-primary p-4 space-y-3">
              <p className="whitespace-pre-line">{reply.content}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {reply.isAnonymous ? (
                    <span className="text-xs text-muted-foreground">Anonymous</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-xs",
                        reply.authorRole === "professional" ? "text-blue-600 font-medium" : "text-muted-foreground"
                      )}>
                        {reply.author}
                      </span>
                      {reply.authorRole === "professional" && (
                        <CheckCircle2 className="h-3 w-3 text-blue-600 fill-blue-600" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                    onClick={() => handleLikeReply(reply.id)}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    <span>{reply.likes}</span>
                  </button>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDistanceToNow(reply.date, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {replies.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No replies yet. Be the first to respond!
            </div>
          )}
          
          <form onSubmit={handleSubmitReply} className="mt-8 space-y-4">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[100px]"
            />
            
            {user?.role === "user" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous-reply"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="anonymous-reply" className="text-sm">
                  Post anonymously
                </label>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
