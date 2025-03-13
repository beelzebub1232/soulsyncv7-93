
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageSquare, Plus, Clock, Search, SortAsc, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ForumCategory, ForumPost } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import NotFound from "../NotFound";
import { PostCard } from "./components/PostCard";
import { NewPostDialog } from "./components/NewPostDialog";
import { formatRelativeTime } from "./utils/dateUtils";

export default function ForumCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load category data
    const loadCategoryData = () => {
      try {
        const storedCategories = localStorage.getItem('soulsync_forum_categories');
        if (storedCategories) {
          const categories: ForumCategory[] = JSON.parse(storedCategories);
          const foundCategory = categories.find(c => c.id === categoryId);
          setCategory(foundCategory || null);
        }
        
        // Load posts for this category
        const storedPosts = localStorage.getItem('soulsync_forum_posts');
        if (storedPosts) {
          const allPosts: ForumPost[] = JSON.parse(storedPosts);
          const categoryPosts = allPosts.filter(post => post.categoryId === categoryId);
          setPosts(categoryPosts);
        }
      } catch (error) {
        console.error("Error loading category data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load forum data."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategoryData();
  }, [categoryId, toast]);
  
  // Filter and sort posts based on search query and sort order
  const filteredAndSortedPosts = () => {
    let filtered = posts;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      );
    }
    
    if (sortOrder === 'recent') {
      return [...filtered].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      return [...filtered].sort((a, b) => 
        (b.likes + b.replies) - (a.likes + a.replies)
      );
    }
  };
  
  const handleCreatePost = (newPost: ForumPost) => {
    // Update posts
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('soulsync_forum_posts', JSON.stringify([...updatedPosts]));
    
    // Update category post count in localStorage
    const storedCategories = localStorage.getItem('soulsync_forum_categories');
    if (storedCategories && category) {
      const categories: ForumCategory[] = JSON.parse(storedCategories);
      const updatedCategories = categories.map(c => 
        c.id === category.id ? { ...c, posts: c.posts + 1 } : c
      );
      localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
      
      // Update local category state
      setCategory({ ...category, posts: category.posts + 1 });
    }
    
    toast({
      title: "Post created",
      description: "Your post has been published to the community."
    });
  };
  
  const handlePostClick = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse-soft text-center">
          <div className="h-10 w-10 rounded-full bg-mindscape-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading forum...</p>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return <NotFound />;
  }
  
  const displayedPosts = filteredAndSortedPosts();
  
  return (
    <div className="space-y-6">
      <header>
        <Link to="/community" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Forums
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-mindscape-light">
            {category.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
            <p className="text-sm mt-1 text-mindscape-primary">{category.posts} {category.posts === 1 ? 'post' : 'posts'}</p>
          </div>
        </div>
      </header>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search in ${category.name}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-mindscape-light focus:border-mindscape-primary"
          />
        </div>
        
        <Button 
          variant={sortOrder === 'recent' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setSortOrder('recent')}
          className="text-xs gap-1"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Recent</span>
        </Button>
        
        <Button 
          variant={sortOrder === 'popular' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setSortOrder('popular')}
          className="text-xs gap-1"
        >
          <Heart className="h-3.5 w-3.5" />
          <span>Popular</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-mindscape-primary" />
            <span>Discussions</span>
          </h2>
          
          <Button
            onClick={() => setIsNewPostOpen(true)}
            className="button-primary flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Button>
        </div>
        
        {displayedPosts.length === 0 ? (
          <div className="card-primary p-5 text-center">
            <p className="text-muted-foreground">No discussions found in this category.</p>
            <Button 
              onClick={() => setIsNewPostOpen(true)}
              className="button-primary mt-3"
            >
              Start the First Discussion
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post.id)}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* New Post Dialog */}
      <NewPostDialog 
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onCreatePost={handleCreatePost}
        categories={[category]}
        currentUser={user}
      />
    </div>
  );
}
