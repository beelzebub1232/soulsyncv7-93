
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { MessageSquare, ChevronLeft } from 'lucide-react';
import { PostDetail } from './components/PostDetail';
import { ReplyForm } from './components/ReplyForm';
import { ReplyCard } from './components/ReplyCard';
import { ForumPost, ForumReply } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export default function ForumPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  
  useEffect(() => {
    const loadPostData = async () => {
      try {
        // Load post data
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
          const postReplies = allReplies.filter(reply => reply.postId === postId);
          
          // Sort replies by date (newest first)
          const sortedReplies = postReplies.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          setReplies(sortedReplies);
        } else {
          // Initialize replies array if it doesn't exist
          localStorage.setItem('soulsync_forum_replies', JSON.stringify([]));
        }
      } catch (error) {
        console.error("Error loading post data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load post data."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPostData();
  }, [postId, toast]);

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !post) {
      toast({
        variant: "destructive",
        title: "Missing content",
        description: "Please enter your reply before submitting."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newReply: ForumReply = {
        id: Date.now().toString(),
        postId: post.id,
        content: replyContent,
        author: isAnonymous ? "Anonymous" : (user?.username || "Current User"),
        date: new Date(),
        isAnonymous,
        likes: 0
      };
      
      // Get all replies
      const storedReplies = localStorage.getItem('soulsync_forum_replies');
      let allReplies: ForumReply[] = storedReplies ? JSON.parse(storedReplies) : [];
      
      // Update replies
      const updatedReplies = [newReply, ...allReplies];
      localStorage.setItem('soulsync_forum_replies', JSON.stringify(updatedReplies));
      
      // Update current post's replies
      setReplies([newReply, ...replies]);
      
      // Update post reply count
      const storedPosts = localStorage.getItem('soulsync_forum_posts');
      if (storedPosts) {
        const allPosts: ForumPost[] = JSON.parse(storedPosts);
        const updatedPosts = allPosts.map(p => 
          p.id === post.id ? { ...p, replies: p.replies + 1 } : p
        );
        localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
        
        // Update current post
        setPost({...post, replies: post.replies + 1});
      }
      
      // Reset form
      setReplyContent("");
      setIsAnonymous(false);
      
      toast({
        title: "Reply posted",
        description: "Your reply has been added to the discussion."
      });
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your reply. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeReply = (replyId: string) => {
    try {
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
        description: "You liked this reply."
      });
    } catch (error) {
      console.error("Error liking reply:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like the reply."
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse-soft text-center">
          <div className="h-10 w-10 rounded-full bg-mindscape-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return <Navigate to="/community" replace />;
  }
  
  return (
    <div className="space-y-6">
      <PostDetail post={post} />
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-mindscape-primary" />
          <span>Replies</span>
        </h2>
        
        <ReplyForm
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          onSubmit={handleSubmitReply}
          disabled={isSubmitting}
        />
        
        {replies.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {replies.map((reply) => (
              <ReplyCard 
                key={reply.id} 
                reply={reply} 
                onLike={handleLikeReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
