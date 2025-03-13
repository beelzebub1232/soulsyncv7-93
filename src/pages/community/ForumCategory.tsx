
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MessageSquare, Plus, Clock, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ForumCategory, ForumPost } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import NotFound from "../NotFound";

export default function ForumCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
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
          
          // Sort posts by date (recent first)
          const sortedPosts = categoryPosts.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          setPosts(sortedPosts);
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
  
  // Filter and sort posts
  const filteredAndSortedPosts = () => {
    // First filter by search query
    let filtered = posts;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      );
    }
    
    // Then sort
    return filtered.sort((a, b) => {
      if (sortOrder === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        // Sort by reply count if sortOrder is 'popular'
        return b.replies - a.replies;
      }
    });
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
            <p className="text-sm mt-1 text-mindscape-primary">{category.posts} posts</p>
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
        
        <Select 
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as 'recent' | 'popular')}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-mindscape-primary" />
            <span>Discussions</span>
          </h2>
          
          <Link to="/community">
            <Button className="button-primary flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </Button>
          </Link>
        </div>
        
        {displayedPosts.length === 0 ? (
          <div className="card-primary p-5 text-center">
            <p className="text-muted-foreground">No discussions found in this category.</p>
            <Link to="/community">
              <button className="button-primary mt-3">
                Start the First Discussion
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedPosts.map((post) => (
              <a 
                key={post.id}
                href={`/community/post/${post.id}`}
                className="card-primary block hover:shadow-md transition-all"
              >
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex justify-between items-center mt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-mindscape-primary">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.replies} replies</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatRelativeTime(post.date)}</span>
                  </div>
                </div>
                
                <div className="text-xs mt-2 text-muted-foreground">
                  Posted by {post.author}
                </div>
              </a>
            ))}
          </div>
        )}
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
