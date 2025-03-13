
import { useState, useEffect } from "react";
import { MessageSquare, Users, Plus, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumPost, ForumCategory } from "@/types/community";

export default function Community() {
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryId: "",
    isAnonymous: false
  });
  const { toast } = useToast();
  
  // Initialize default categories and posts
  useEffect(() => {
    // Default categories
    const defaultCategories: ForumCategory[] = [
      {
        id: "anxiety",
        name: "Anxiety Support",
        description: "Share coping strategies and support for anxiety",
        icon: "😰",
        posts: 128,
        color: "border-yellow-300"
      },
      {
        id: "depression",
        name: "Depression Support",
        description: "A safe space to discuss depression and find support",
        icon: "😔",
        posts: 215,
        color: "border-blue-300"
      },
      {
        id: "mindfulness",
        name: "Mindfulness Practice",
        description: "Discussions about meditation and mindfulness techniques",
        icon: "🧘",
        posts: 96,
        color: "border-green-300"
      },
      {
        id: "general",
        name: "General Wellness",
        description: "General discussions about mental wellbeing",
        icon: "💜",
        posts: 173,
        color: "border-purple-300"
      }
    ];
    
    // Load categories from storage, or use defaults
    const storedCategories = localStorage.getItem('soulsync_forum_categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('soulsync_forum_categories', JSON.stringify(defaultCategories));
    }
    
    // Load posts from storage
    const storedPosts = localStorage.getItem('soulsync_forum_posts');
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      setPosts(parsedPosts);
      setFilteredPosts(parsedPosts);
    }
  }, []);
  
  // Filter posts when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) || 
      post.content.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);
  
  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.categoryId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    const category = categories.find(c => c.id === newPost.categoryId);
    if (!category) return;
    
    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      categoryId: newPost.categoryId,
      categoryName: category.name,
      author: newPost.isAnonymous ? "Anonymous" : "Current User",
      date: new Date(),
      replies: 0,
      isAnonymous: newPost.isAnonymous
    };
    
    // Update posts
    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
    
    // Update category post count
    const updatedCategories = categories.map(c => 
      c.id === post.categoryId ? { ...c, posts: c.posts + 1 } : c
    );
    setCategories(updatedCategories);
    localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
    
    // Reset form and close dialog
    setNewPost({
      title: "",
      content: "",
      categoryId: "",
      isAnonymous: false
    });
    setIsNewPostOpen(false);
    
    toast({
      title: "Post created",
      description: "Your post has been published to the community."
    });
  };
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Community</h1>
          <p className="text-muted-foreground">Support forums and discussions</p>
        </div>
        
        <button 
          onClick={() => setIsNewPostOpen(true)}
          className="w-10 h-10 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
          aria-label="New Discussion"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-mindscape-light focus:border-mindscape-primary"
          />
        </div>
        
        <button 
          className="w-10 h-10 rounded-lg border border-input bg-background hover:bg-accent flex items-center justify-center"
          aria-label="Filter"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>
      
      <Tabs defaultValue="forums" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forums" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-mindscape-primary" />
              <span>Support Forums</span>
            </h2>
          </div>
          
          <div className="space-y-3">
            {categories.map((category) => (
              <a 
                key={category.id}
                href={`/community/${category.id}`}
                className={`card-primary block hover:shadow-md transition-all border-l-4 ${category.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center text-xl">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <div className="mt-1 text-xs text-mindscape-primary">
                      {category.posts} posts
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-mindscape-primary" />
              <span>Recent Discussions</span>
            </h2>
            
            <Select 
              defaultValue="recent"
              onValueChange={(value) => {
                // Sort functionality would go here
                console.log("Sort by:", value);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="replies">Most Replies</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="card-primary p-5 text-center">
                <p className="text-muted-foreground">No discussions found.</p>
                <button 
                  onClick={() => setIsNewPostOpen(true)} 
                  className="button-primary mt-3"
                >
                  Start a Discussion
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <a 
                  key={post.id}
                  href={`/community/post/${post.id}`}
                  className="card-primary block hover:shadow-md transition-all"
                >
                  <h3 className="font-medium">{post.title}</h3>
                  
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-mindscape-primary">{post.categoryName}</span>
                    <div className="text-muted-foreground">
                      Posted by {post.author} · {formatRelativeTime(post.date)}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs">
                    <span className="text-muted-foreground">{post.replies} replies</span>
                  </div>
                </a>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* New Post Dialog */}
      <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a Discussion</DialogTitle>
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
            
            <div className="space-y-2">
              <Label htmlFor="post-category">Category</Label>
              <Select 
                value={newPost.categoryId}
                onValueChange={(value) => setNewPost({...newPost, categoryId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      
      <div className="text-center pt-4">
        <button 
          onClick={() => setIsNewPostOpen(true)}
          className="button-primary"
        >
          Start a Discussion
        </button>
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
