
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ForumPost, ForumReply } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Heart, Flag, CheckCircle2, Calendar, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
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
  const [isLiked, setIsLiked] = useState(false);
  const [likedReplies, setLikedReplies] = useState<string[]>([]);
  
  // Load liked posts and replies from localStorage
  useEffect(() => {
    if (user) {
      const savedLikedPosts = localStorage.getItem(`soulsync_liked_posts_${user.id}`);
      if (savedLikedPosts && postId) {
        const likedPostsList = JSON.parse(savedLikedPosts);
        setIsLiked(likedPostsList.includes(postId));
      }
      
      const savedLikedReplies = localStorage.getItem(`soulsync_liked_replies_${user.id}`);
      if (savedLikedReplies) {
        setLikedReplies(JSON.parse(savedLikedReplies));
      }
    }
  }, [user, postId]);
  
  // Save liked replies to localStorage when changed
  useEffect(() => {
    if (user && likedReplies.length > 0) {
      localStorage.setItem(`soulsync_liked_replies_${user.id}`, JSON.stringify(likedReplies));
    }
  }, [likedReplies, user]);
  
  // Load post and replies from localStorage
  useEffect(() => {
    if (postId) {
      // Check all categories for the post
      const categories = ["anxiety", "depression", "mindfulness", "stress", "general"];
      let foundPost = null;
      
      for (const category of categories) {
        const savedPosts = localStorage.getItem(`soulsync_posts_${category}`);
        if (savedPosts) {
          const posts = JSON.parse(savedPosts);
          const match = posts.find((p: ForumPost) => p.id === postId);
          if (match) {
            // Convert date string back to Date object
            foundPost = {
              ...match,
              date: new Date(match.date)
            };
            break;
          }
        }
      }
      
      // If found in localStorage, use it; otherwise use mock data
      if (foundPost) {
        setPost(foundPost);
      } else {
        // Mock post as fallback
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
          replies: 0,
          isAnonymous: true,
          likes: 0
        };
        
        setPost(mockPost);
      }
      
      // Load replies from localStorage
      const savedReplies = localStorage.getItem(`soulsync_replies_${postId}`);
      if (savedReplies) {
        const parsedReplies = JSON.parse(savedReplies).map((reply: ForumReply) => ({
          ...reply,
          date: new Date(reply.date)
        }));
        setReplies(parsedReplies);
      } else {
        // Mock replies as fallback
        setReplies([]);
      }
    }
  }, [postId]);
  
  // Update post in its category
  const updatePostInCategory = (updatedPost: ForumPost) => {
    const categoryId = updatedPost.categoryId;
    const savedPosts = localStorage.getItem(`soulsync_posts_${categoryId}`);
    
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      const updatedPosts = allPosts.map((p: ForumPost) => 
        p.id === updatedPost.id ? updatedPost : p
      );
      
      localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify(updatedPosts));
    }
  };
  
  const handleLikePost = () => {
    if (!user || !post) return;
    
    // Toggle like state
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    
    // Update post likes count
    const updatedPost = {
      ...post,
      likes: newIsLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
    };
    setPost(updatedPost);
    
    // Update liked posts in localStorage
    const savedLikedPosts = localStorage.getItem(`soulsync_liked_posts_${user.id}`);
    let likedPostsList: string[] = savedLikedPosts ? JSON.parse(savedLikedPosts) : [];
    
    if (newIsLiked) {
      likedPostsList.push(post.id);
    } else {
      likedPostsList = likedPostsList.filter(id => id !== post.id);
    }
    
    localStorage.setItem(`soulsync_liked_posts_${user.id}`, JSON.stringify(likedPostsList));
    
    // Update post in its category
    updatePostInCategory(updatedPost);
    
    toast({
      title: newIsLiked ? "Post liked" : "Post unliked",
      description: newIsLiked ? "You liked this post" : "You removed your like from this post",
    });
  };
  
  const handleLikeReply = (replyId: string) => {
    if (!user) return;
    
    // Check if reply is already liked
    const isReplyLiked = likedReplies.includes(replyId);
    
    // Toggle like state
    let newLikedReplies: string[];
    if (isReplyLiked) {
      newLikedReplies = likedReplies.filter(id => id !== replyId);
    } else {
      newLikedReplies = [...likedReplies, replyId];
    }
    setLikedReplies(newLikedReplies);
    
    // Update reply likes count
    const updatedReplies = replies.map(reply => {
      if (reply.id === replyId) {
        return {
          ...reply,
          likes: isReplyLiked ? Math.max(0, reply.likes - 1) : reply.likes + 1
        };
      }
      return reply;
    });
    
    setReplies(updatedReplies);
    
    // Save updated replies to localStorage
    localStorage.setItem(`soulsync_replies_${postId}`, JSON.stringify(updatedReplies));
    
    // Save liked replies to localStorage
    localStorage.setItem(`soulsync_liked_replies_${user.id}`, JSON.stringify(newLikedReplies));
    
    toast({
      title: isReplyLiked ? "Reply unliked" : "Reply liked",
      description: isReplyLiked ? "You removed your like from this reply" : "You liked this reply",
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
    
    if (!user || !post) return;
    
    if (!replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty reply",
        description: "Please enter some content for your reply",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new reply
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
    
    // Update replies
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    
    // Save to localStorage
    localStorage.setItem(`soulsync_replies_${post.id}`, JSON.stringify(updatedReplies));
    
    // Update post reply count in parent post
    const updatedPost = {
      ...post,
      replies: post.replies + 1
    };
    setPost(updatedPost);
    
    // Update post in its category
    updatePostInCategory(updatedPost);
    
    setReplyContent("");
    setIsSubmitting(false);
    
    toast({
      title: "Reply posted",
      description: "Your reply has been added to the discussion",
    });
  };
  
  // Function to render YouTube embeds
  const renderYouTubeEmbed = (url: string) => {
    // Extract video ID from YouTube URL
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      const videoId = match[1];
      return (
        <div className="aspect-video w-full rounded-lg overflow-hidden mt-3 mb-4">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    
    return null;
  };
  
  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Link to={`/community/category/${post.categoryId}`} className="flex items-center text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span className="text-sm">Back to {post.categoryName}</span>
      </Link>
      
      <div className="card-primary p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-lg sm:text-xl font-medium">{post.title}</h1>
          <div className="flex items-center gap-2">
            <button 
              className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} transition-colors`}
              onClick={handleLikePost}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
              <span>{post.likes}</span>
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <Flag className="h-5 w-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
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
        
        <div className="bg-accent/50 p-3 sm:p-4 rounded-lg">
          <p className="whitespace-pre-line text-sm">{post.content}</p>
          
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {post.images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded overflow-hidden">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
          
          {/* Video Links */}
          {post.videoLinks && post.videoLinks.map((link, idx) => (
            renderYouTubeEmbed(link) || (
              <a 
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-500 text-sm flex items-center break-all"
              >
                <Youtube className="h-4 w-4 mr-1 flex-shrink-0" />
                {link}
              </a>
            )
          ))}
        </div>
        
        <div className="flex justify-between items-center text-xs sm:text-sm">
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
        <h2 className="text-base sm:text-lg font-medium mb-3">Replies ({replies.length})</h2>
        
        <div className="space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="card-primary p-3 sm:p-4 space-y-3">
              <p className="whitespace-pre-line text-sm">{reply.content}</p>
              
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
                    className={`flex items-center gap-1 text-xs ${likedReplies.includes(reply.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} transition-colors`}
                    onClick={() => handleLikeReply(reply.id)}
                  >
                    <Heart className={`h-3.5 w-3.5 ${likedReplies.includes(reply.id) ? 'fill-red-500' : ''}`} />
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
          
          {user && (
            <form onSubmit={handleSubmitReply} className="mt-6 space-y-3">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px]"
              />
              
              {user?.role === "user" && (
                <div className="flex items-center gap-2">
                  <Switch
                    id="anonymous-reply"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <label htmlFor="anonymous-reply" className="text-sm cursor-pointer">
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
          )}
        </div>
      </div>
    </div>
  );
}
