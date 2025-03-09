
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MessageSquare, Plus, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ForumCategory, ForumPost } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/contexts/UserContext";
import NotFound from "../NotFound";

export default function ForumCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    isAnonymous: false
  });
  const { toast } = useToast();
  const { user } = useUser();
  
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
  
  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (!category) return;
    
    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      categoryId: category.id,
      categoryName: category.name,
      author: newPost.isAnonymous ? "Anonymous" : (user?.username || "Current User"),
      date: new Date(),
      replies: 0,
      isAnonymous: newPost.isAnonymous
    };
    
    // Get all posts
    const storedPosts = localStorage.getItem('soulsync_forum_posts');
    let allPosts: ForumPost[] = storedPosts ? JSON.parse(storedPosts) : [];
    
    // Update posts
    const updatedPosts = [post, ...allPosts];
    localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
    
    // Update current category's posts
    setPosts([post, ...posts]);
    
    // Update category post count
    const storedCategories = localStorage.getItem('soulsync_forum_categories');
    if (storedCategories) {
      const categories: ForumCategory[] = JSON.parse(storedCategories);
      const updatedCategories = categories.map(c => 
        c.id === category.id ? { ...c, posts: c.posts + 1 } : c
      );
      localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
    }
    
    // Reset form and close dialog
    setNewPost({
      title: "",
      content: "",
      isAnonymous: false
    });
    setIsNewPostOpen(false);
    
    toast({
      title: "Post created",
      description: "Your post has been published to the community."
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
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
          <SelectTrigger className="w-full sm:w-[130px]">
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
          
          <Button 
            className="button-primary flex items-center gap-1"
            onClick={() => setIsNewPostOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Button>
        </div>
        
        {displayedPosts.length === 0 ? (
          <div className="card-primary p-5 text-center">
            <p className="text-muted-foreground">No discussions found in this category.</p>
            <Button 
              className="button-primary mt-3"
              onClick={() => setIsNewPostOpen(true)}
            >
              Start the First Discussion
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedPosts.map((post) => (
              <Card 
                key={post.id}
                className="hover:shadow-md transition-all"
              >
                <CardContent className="p-4">
                  <Link to={`/community/post/${post.id}`}>
                    <h3 className="font-medium hover:text-mindscape-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
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
                  
                  <div className="flex items-center mt-2 text-xs">
                    {post.isAnonymous ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          <span className="text-xs">?</span>
                        </div>
                        <span className="text-muted-foreground">Anonymous</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{post.author}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* New Post Dialog */}
      <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Post in {category.name}</DialogTitle>
            <DialogDescription>
              Share your thoughts with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                placeholder="What would you like to discuss?"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                placeholder="Share your thoughts, questions or experiences..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous-mode"
                checked={newPost.isAnonymous}
                onCheckedChange={(checked) => setNewPost({...newPost, isAnonymous: checked})}
              />
              <Label htmlFor="anonymous-mode">Post anonymously</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} className="button-primary">
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
