
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MessageSquare, Heart, Clock, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ForumPost, ForumReply } from "@/types/community";
import { useUser } from "@/contexts/UserContext";
import NotFound from "../NotFound";

export default function ForumPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  
  useEffect(() => {
    // Load post and replies
    const loadPostData = () => {
      try {
        // Load post
        const storedPosts = localStorage.getItem('soulsync_forum_posts');
        if (storedPosts) {
          const allPosts: ForumPost[] = JSON.parse(storedPosts);
          const foundPost = allPosts.find(p => p.id === postId);
          setPost(foundPost || null);
        }
        
        // Load replies
        const storedReplies = localStorage.getItem('soulsync_forum_replies');
        if (storedReplies) {
          const allReplies: ForumReply[] = JSON.parse(storedReplies);
          const postReplies = allReplies.filter(r => r.postId === postId);
          
          // Sort replies by date (oldest first for conversation flow)
          const sortedReplies = postReplies.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          setReplies(sortedReplies);
        }
      } catch (error) {
        console.error("Error loading post data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load post and replies."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPostData();
  }, [postId, toast]);
  
  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty reply",
        description: "Please enter some content for your reply."
      });
      return;
    }
    
    if (!post) return;
    
    // Create new reply
    const newReply: ForumReply = {
      id: Date.now().toString(),
      postId: post.id,
      content: replyContent,
      author: isAnonymous ? "Anonymous" : (user?.username || "Current User"),
      date: new Date(),
      isAnonymous: isAnonymous,
      likes: 0
    };
    
    // Get all replies
    const storedReplies = localStorage.getItem('soulsync_forum_replies');
    let allReplies: ForumReply[] = storedReplies ? JSON.parse(storedReplies) : [];
    
    // Update replies
    const updatedReplies = [...allReplies, newReply];
    localStorage.setItem('soulsync_forum_replies', JSON.stringify(updatedReplies));
    
    // Update current replies
    setReplies([...replies, newReply]);
    
    // Update post reply count
    const storedPosts = localStorage.getItem('soulsync_forum_posts');
    if (storedPosts) {
      const allPosts: ForumPost[] = JSON.parse(storedPosts);
      const updatedPosts = allPosts.map(p => 
        p.id === post.id ? { ...p, replies: p.replies + 1 } : p
      );
      localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
      
      // Update current post
      setPost({ ...post, replies: post.replies + 1 });
    }
    
    // Reset form
    setReplyContent("");
    
    toast({
      title: "Reply posted",
      description: "Your reply has been added to the discussion."
    });
  };
  
  const handleLikeReply = (replyId: string) => {
    // Get all replies
    const storedReplies = localStorage.getItem('soulsync_forum_replies');
    if (!storedReplies) return;
    
    const allReplies: ForumReply[] = JSON.parse(storedReplies);
    
    // Update liked reply
    const updatedReplies = allReplies.map(r => 
      r.id === replyId ? { ...r, likes: r.likes + 1 } : r
    );
    
    localStorage.setItem('soulsync_forum_replies', JSON.stringify(updatedReplies));
    
    // Update current replies
    setReplies(replies.map(r => 
      r.id === replyId ? { ...r, likes: r.likes + 1 } : r
    ));
    
    toast({
      title: "Reply liked",
      description: "You liked this reply.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse-soft text-center">
          <div className="h-10 w-10 rounded-full bg-mindscape-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading discussion...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return <NotFound />;
  }
  
  return (
    <div className="space-y-6">
      <header>
        <Link to="/community" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Community
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <Link 
            to={`/community/${post.categoryId}`}
            className="text-xs px-2 py-1 rounded-full bg-mindscape-light text-mindscape-primary hover:bg-mindscape-light/80"
          >
            {post.categoryName}
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold font-display mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {post.isAnonymous ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">?</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Anonymous</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(post.date)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar>
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{post.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(post.date)}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{post.replies} replies</span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{post.content}</p>
            </div>
          </CardContent>
        </Card>
      </header>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{replies.length} Replies</h2>
        
        <div className="space-y-4">
          {replies.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
            </div>
          ) : (
            replies.map((reply) => (
              <Card key={reply.id} className="border-l-2 border-l-mindscape-light">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {reply.isAnonymous ? (
                        <>
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <span className="text-xs">?</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Anonymous</p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(reply.date)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Avatar className="w-7 h-7">
                            <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{reply.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(reply.date)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-muted-foreground hover:text-mindscape-primary"
                      onClick={() => handleLikeReply(reply.id)}
                    >
                      <Heart className="h-4 w-4" />
                      <span>{reply.likes}</span>
                    </Button>
                  </div>
                  
                  <div className="text-sm whitespace-pre-line">
                    {reply.content}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <Card className="mt-8">
          <CardContent className="p-4">
            <h3 className="text-md font-medium mb-3">Write a reply</h3>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts on this discussion..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Switch
                    id="reply-anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label htmlFor="reply-anonymous">Reply anonymously</Label>
                </div>
                
                <Button 
                  onClick={handleSubmitReply}
                  className="button-primary flex items-center gap-1"
                >
                  <Send className="h-4 w-4" />
                  Post Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
}
