
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ForumPost, ForumCategory } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Heart, MessageSquare, Brain, Flame, Book, Globe, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import { NewPostSheet } from "./components/NewPostSheet";
import { PostItem } from "./components/PostItem";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function CategoryPosts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useUser();
  const { toast } = useToast();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  
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
        posts: 0,
        color: "bg-blue-100"
      },
      {
        id: "depression",
        name: "Depression",
        description: "A safe space to talk about depression and coping strategies",
        icon: "brain",
        posts: 0,
        color: "bg-purple-100"
      },
      {
        id: "mindfulness",
        name: "Mindfulness",
        description: "Share mindfulness practices and meditation techniques",
        icon: "flame",
        posts: 0,
        color: "bg-green-100"
      },
      {
        id: "stress",
        name: "Stress Management",
        description: "Tips and discussions about managing stress in daily life",
        icon: "book",
        posts: 0,
        color: "bg-orange-100"
      },
      {
        id: "general",
        name: "General Discussions",
        description: "Open discussions about mental wellness and self-care",
        icon: "globe",
        posts: 0,
        color: "bg-gray-100"
      }
    ];
    
    const foundCategory = mockCategories.find(c => c.id === categoryId);
    setCategory(foundCategory || null);
  }, [categoryId]);
  
  // Load posts from localStorage
  useEffect(() => {
    if (categoryId) {
      // Load posts from localStorage
      const loadPosts = () => {
        const savedPosts = localStorage.getItem(`soulsync_posts_${categoryId}`);
        if (savedPosts) {
          // Convert date strings back to Date objects
          const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
            ...post,
            date: new Date(post.date)
          }));
          setPosts(parsedPosts);
        } else {
          // Initialize with empty array if no posts exist
          localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify([]));
          setPosts([]);
        }
      };
      
      // Load posts initially
      loadPosts();
      
      // Set up event listener for storage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === `soulsync_posts_${categoryId}`) {
          loadPosts();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      // Custom event for post updates
      const handlePostsUpdated = () => loadPosts();
      window.addEventListener('postsUpdated', handlePostsUpdated);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('postsUpdated', handlePostsUpdated);
      };
    }
  }, [categoryId]);
  
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
    let updatedLikedPosts: string[];
    if (isLiked) {
      updatedLikedPosts = likedPosts.filter(id => id !== postId);
      setLikedPosts(updatedLikedPosts);
    } else {
      updatedLikedPosts = [...likedPosts, postId];
      setLikedPosts(updatedLikedPosts);
    }
    
    // Save liked posts to localStorage
    localStorage.setItem(`soulsync_liked_posts_${user.id}`, JSON.stringify(updatedLikedPosts));
    
    // Update post likes count
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    
    // Save the updated posts to localStorage
    localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify(updatedPosts));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('postsUpdated'));
    
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
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('postsUpdated'));
    
    setIsNewPostOpen(false);
    
    toast({
      title: "Post created",
      description: "Your post has been published successfully",
    });
  };
  
  const handleEditPost = (post: ForumPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (!editingPost) return;
    
    const updatedPosts = posts.map(post => {
      if (post.id === editingPost.id) {
        return {
          ...post,
          title: editTitle,
          content: editContent,
          isEdited: true
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify(updatedPosts));
    
    // Update post in replies storage too
    const savedReplies = localStorage.getItem(`soulsync_replies_${editingPost.id}`);
    if (savedReplies) {
      // No need to modify replies, but we want to trigger updates
      localStorage.setItem(`soulsync_replies_${editingPost.id}`, savedReplies);
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('postsUpdated'));
    
    setIsEditDialogOpen(false);
    setEditingPost(null);
    
    toast({
      title: "Post updated",
      description: "Your post has been updated successfully",
    });
  };
  
  const confirmDeletePost = (postId: string) => {
    setPostToDelete(postId);
  };
  
  const handleDeletePost = () => {
    if (!postToDelete) return;
    
    // Remove post from state
    const updatedPosts = posts.filter(post => post.id !== postToDelete);
    setPosts(updatedPosts);
    
    // Save to localStorage
    localStorage.setItem(`soulsync_posts_${categoryId}`, JSON.stringify(updatedPosts));
    
    // Remove replies for this post
    localStorage.removeItem(`soulsync_replies_${postToDelete}`);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('postsUpdated'));
    
    setPostToDelete(null);
    
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully",
    });
  };
  
  const canUserEditPost = (post: ForumPost) => {
    if (!user) return false;
    return post.authorId === user.id;
  };
  
  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 pb-16">
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
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
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
                <div key={post.id} className="relative">
                  <PostItem 
                    post={post} 
                    onLike={handleLikePost}
                    isLiked={likedPosts.includes(post.id)}
                  />
                  
                  {canUserEditPost(post) && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleEditPost(post)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => confirmDeletePost(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                </div>
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
      
      {/* Edit Post Dialog */}
      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Post</AlertDialogTitle>
            <AlertDialogDescription>
              Make changes to your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-content" className="text-sm font-medium">Content</label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEdit}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Post Confirmation Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
