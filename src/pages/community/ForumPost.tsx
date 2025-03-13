
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { ForumPost as ForumPostType, ForumReply } from "@/types/community";
import { formatRelativeTime } from "./utils/dateUtils";
import { ArrowLeft, MessageSquare, Heart, Flag, Shield, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ForumPost() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [post, setPost] = useState<ForumPostType | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  useEffect(() => {
    // Load post data
    const storedPosts = localStorage.getItem('soulsync_forum_posts');
    if (storedPosts) {
      const parsedPosts: ForumPostType[] = JSON.parse(storedPosts);
      const foundPost = parsedPosts.find(p => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
      } else {
        toast({
          variant: "destructive",
          title: "Post not found",
          description: "The post you're looking for doesn't exist."
        });
        navigate('/community');
      }
    }
    
    // Load replies
    const storedReplies = localStorage.getItem('soulsync_forum_replies');
    if (storedReplies && postId) {
      const parsedReplies: ForumReply[] = JSON.parse(storedReplies);
      const postReplies = parsedReplies.filter(reply => reply.postId === postId);
      setReplies(postReplies);
    }
  }, [postId, navigate, toast]);
  
  const handleSubmitReply = () => {
    if (!newReply.trim()) {
      toast({
        variant: "destructive",
        title: "Empty reply",
        description: "Please write something before posting."
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to reply."
      });
      return;
    }
    
    const reply: ForumReply = {
      id: crypto.randomUUID(),
      postId: postId || '',
      content: newReply,
      author: user.username,
      authorId: user.id,
      authorRole: user.role,
      date: new Date(),
      isAnonymous,
      likes: 0,
      isReported: false
    };
    
    // Save reply
    const storedReplies = localStorage.getItem('soulsync_forum_replies');
    const allReplies = storedReplies ? JSON.parse(storedReplies) : [];
    localStorage.setItem('soulsync_forum_replies', JSON.stringify([...allReplies, reply]));
    
    // Update post reply count
    if (post) {
      const storedPosts = localStorage.getItem('soulsync_forum_posts');
      if (storedPosts) {
        const parsedPosts: ForumPostType[] = JSON.parse(storedPosts);
        const updatedPosts = parsedPosts.map(p => 
          p.id === post.id ? { ...p, replies: p.replies + 1 } : p
        );
        localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
        setPost({ ...post, replies: post.replies + 1 });
      }
    }
    
    // Add to local state
    setReplies([...replies, reply]);
    setNewReply("");
    setIsAnonymous(false);
    
    toast({
      title: "Reply posted",
      description: "Your reply has been added to the discussion."
    });
  };
  
  const displayAuthor = (author: string, authorId: string, authorRole: 'user' | 'professional' | 'admin', isAnonymous: boolean) => {
    if (isAnonymous && (!user || authorId !== user.id) && user?.role !== 'admin') {
      return 'Anonymous';
    }
    
    if (user && authorId === user.id) {
      return `${author} (you)`;
    }
    
    return author;
  };
  
  if (!post) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Loading post...</h2>
          <p className="text-muted-foreground">Please wait while we load the post details.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6 max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(`/community/category/${post.categoryId}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to {post.categoryName}
      </Button>
      
      {/* Post details */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{post.title}</h1>
              <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-2">
                <span>{displayAuthor(post.author, post.authorId, post.authorRole, post.isAnonymous)}</span>
                {post.authorRole === 'professional' && !post.isAnonymous && (
                  <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4">
                    <Shield className="h-2.5 w-2.5 mr-0.5" /> Pro
                  </Badge>
                )}
                <span>·</span>
                <span>{formatRelativeTime(post.date)}</span>
                <span>·</span>
                <Badge variant="secondary">{post.categoryName}</Badge>
              </div>
            </div>
            
            {post.isReported && (user?.role === 'admin' || user?.role === 'professional') && (
              <Badge variant="destructive">Reported</Badge>
            )}
          </div>
          
          <div className="py-4 border-t border-b">
            <p className="whitespace-pre-wrap">{post.content}</p>
            
            {post.media && post.media.length > 0 && (
              <div className="mt-4 space-y-3">
                {post.media.map((item, index) => (
                  <div key={index}>
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt="Post attachment" 
                        className="max-h-80 object-contain rounded-md"
                      />
                    ) : (
                      <div className="aspect-video">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={item.url} 
                          title="Video attachment"
                          allowFullScreen
                          className="rounded-md"
                        ></iframe>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.replies}</span>
            </Button>
            
            {!user || (user.id !== post.authorId && user.role !== 'admin') ? (
              <Button variant="ghost" size="sm" className="gap-1">
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="gap-1">
                <MoreHorizontal className="h-4 w-4" />
                <span>Options</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {replies.length > 0 
            ? `Replies (${replies.length})` 
            : 'No replies yet'}
        </h2>
        
        {replies.map((reply) => (
          <Card key={reply.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center text-sm space-x-2 mb-2">
                <span className="font-medium">
                  {displayAuthor(reply.author, reply.authorId, reply.authorRole, reply.isAnonymous)}
                </span>
                {reply.authorRole === 'professional' && !reply.isAnonymous && (
                  <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4">
                    <Shield className="h-2.5 w-2.5 mr-0.5" /> Pro
                  </Badge>
                )}
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{formatRelativeTime(reply.date)}</span>
              </div>
              
              {reply.isReported && (user?.role === 'admin' || user?.role === 'professional') && (
                <Badge variant="destructive">Reported</Badge>
              )}
            </div>
            
            <p className="whitespace-pre-wrap">{reply.content}</p>
            
            {reply.media && reply.media.length > 0 && (
              <div className="mt-3 space-y-3">
                {reply.media.map((item, index) => (
                  <div key={index}>
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt="Reply attachment" 
                        className="max-h-60 object-contain rounded-md"
                      />
                    ) : (
                      <div className="aspect-video">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={item.url} 
                          title="Video attachment"
                          allowFullScreen
                          className="rounded-md"
                        ></iframe>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-3 pt-2 flex items-center gap-3">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{reply.likes}</span>
              </Button>
              
              {!user || (user.id !== reply.authorId && user.role !== 'admin') ? (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                  <Flag className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Reply form */}
      {user && (
        <Card className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="Write your reply..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous-reply"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="anonymous-reply" className="text-sm">
                  Post anonymously
                </label>
              </div>
              
              <Button onClick={handleSubmitReply} className="button-primary">
                <Send className="h-4 w-4 mr-2" />
                Post Reply
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {!user && (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">You need to be logged in to reply to this post.</p>
          <Button onClick={() => navigate('/auth')} className="mt-2">
            Login or Register
          </Button>
        </Card>
      )}
    </div>
  );
}
