
import { useState, useEffect } from "react";
import { ForumPost, ForumReply } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export function useForumPost(postId: string | undefined) {
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  
  useEffect(() => {
    const loadPostData = () => {
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
          
          // Sort replies by date (recent first)
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

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !post) {
      toast({
        variant: "destructive",
        title: "Missing content",
        description: "Please enter your reply before submitting."
      });
      return;
    }
    
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
  };

  return {
    post,
    replies,
    isLoading,
    replyContent,
    setReplyContent,
    isAnonymous,
    setIsAnonymous,
    handleSubmitReply
  };
}
