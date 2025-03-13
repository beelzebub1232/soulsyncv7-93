
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ForumPost, ForumCategory } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Heart, MessageSquare, Brain, Flame, Book, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import { NewPostSheet } from "./components/NewPostSheet";
import { PostItem } from "./components/PostItem";
import { useToast } from "@/hooks/use-toast";

export default function CategoryPosts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useUser();
  const { toast } = useToast();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  // Get category icon
  const getCategoryIcon = () => {
    if (!categoryId) return <Heart className="h-6 w-6 text-primary" />;
    
    switch(categoryId) {
      case 'anxiety':
        return <Heart className="h-6 w-6 text-primary" />;
      case 'depression':
        return <Brain className="h-6 w-6 text-primary" />;
      case 'mindfulness':
        return <Flame className="h-6 w-6 text-primary" />;
      case 'stress':
        return <Book className="h-6 w-6 text-primary" />;
      case 'general':
        return <Globe className="h-6 w-6 text-primary" />;
      default:
        return <Heart className="h-6 w-6 text-primary" />;
    }
  };
  
  // Load liked posts from localStorage
  useEffect(() => {
    if (user) {
      const savedLikedPosts = localStorage.getItem(`soulsync_liked_posts_${user.id}`);
      if (savedLikedPosts) {
        setLikedPosts(JSON.parse(savedLikedPosts));
      }
    }
  }, [user]);
  
  // Save liked posts to localStorage when changed
  useEffect(() => {
    if (user && likedPosts.length > 0) {
      localStorage.setItem(`soulsync_liked_posts_${user.id}`, JSON.stringify(likedPosts));
    }
  }, [likedPosts, user]);
  
  // Simulate loading category data
  useEffect(() => {
    // This would be a real API call in a production app
    const mockCategories = [
      {
        id: "anxiety",
        name: "Anxiety Support",
        description: "Discuss anxiety management techniques and share experiences",
        icon: "heart",
        posts: 24,
        color: "bg-blue-100"
      },
      {
        id: "depression",
        name: "Depression",
        description: "A safe space to talk about depression and coping strategies",
        icon: "brain",
        posts: 18,
        color: "bg-purple-100"
      },
      {
        id: "mindfulness",
        name: "Mindfulness",
        description: "Share mindfulness practices and meditation techniques",
        icon: "flame",
        posts: 32,
        color: "bg-green-100"
      },
      {
        id: "stress",
        name: "Stress Management",
        description: "Tips and discussions about managing stress in daily life",
        icon: "book",
        posts: 15,
        color: "bg-orange-100"
      },
      {
        id: "general",
        name: "General Discussions",
        description: "Open discussions about mental wellness and self-care",
        icon: "globe",
        posts: 42,
        color: "bg-gray-100"
      }
    ];
    
    const foundCategory = mockCategories.find(c => c.id === categoryId);
    setCategory(foundCategory || null);
  }, [categoryId]);
  
  // Load posts from localStorage and merge with mock data
  useEffect(() => {
    if (categoryId) {
      // Get saved posts from localStorage
      const savedPosts = localStorage.getItem(`soulsync_posts_${categoryId}`);
      let userPosts: ForumPost[] = savedPosts ? JSON.parse(savedPosts) : [];
      
      // Convert date strings back to Date objects
      userPosts = userPosts.map(post => ({
        ...post,
        date: new Date(post.date)
      }));
      
      // Mock posts as fallback
      const mockPosts: ForumPost[] = [
        {
          id: "post1",
          title: "How to handle anxiety during presentations?",
          content: "I struggle with severe anxiety when giving presentations at work. Any tips that have worked for you?",
          categoryId: categoryId,
          categoryName: category?.name || "",
          author: "Anonymous",
          authorId: "user123",
          authorRole: "user",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          replies: 0,
          isAnonymous: true,
          likes: 0
        },
        {
          id: "post2",
          title: "Breathing techniques that helped me",
          content: "I've been practicing these breathing exercises for the past month and they've made a huge difference.",
          categoryId: categoryId,
          categoryName: category?.name || "",
          author: "Dr. Emily Chen",
          authorId: "prof123",
          authorRole: "professional",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          replies: 0,
          isAnonymous: false,
          likes: 0
        }
      ];
      
      // If we have user posts, use those; otherwise use mock posts
      setPosts(userPosts.length > 0 ? userPosts : mockPosts);
    }
  }, [categoryId, category]);
  
  // Handle liking a post
  const handleLikePost = (postId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    // Check if post is already liked
    const isLiked = likedPosts.includes(postId);
    
    // Update likedPosts state
    if (isLiked) {
      setLikedPosts(prev => prev.filter(id => id !== postId));
    } else {
      setLikedPosts(prev => [...prev, postId]);
    }
    
    // Update post likes count
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1
          };
        }
        return post;
      })
    );
    
    // Save the updated posts to localStorage
    setTimeout(() => {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1
          };
        }
        return post;
      });
      localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify(updatedPosts));
    }, 100);
    
    toast({
      title: isLiked ? "Post unliked" : "Post liked",
      description: isLiked ? "You removed your like from this post" : "You liked this post",
    });
  };
  
  const handleNewPost = (post: ForumPost) => {
    // Add the new post to the state
    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    
    // Save to localStorage
    localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify(updatedPosts));
    
    setIsNewPostOpen(false);
    
    toast({
      title: "Post created",
      description: "Your post has been published successfully",
    });
  };
  
  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Link to="/community" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Back</span>
        </Link>
        
        <Button 
          className="button-primary h-9 px-3 py-2 text-sm"
          onClick={() => setIsNewPostOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Post
        </Button>
      </div>
      
      <Card className="border-border/50">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
              {getCategoryIcon()}
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">{category.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 py-3">
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map(post => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onLike={handleLikePost}
                  isLiked={likedPosts.includes(post.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No posts yet</p>
              <Button className="mt-4" onClick={() => setIsNewPostOpen(true)}>
                Create the first post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewPostSheet 
        isOpen={isNewPostOpen} 
        onClose={() => setIsNewPostOpen(false)}
        onSubmit={handleNewPost}
        categoryId={categoryId || ""}
        categoryName={category.name}
      />
    </div>
  );
}
