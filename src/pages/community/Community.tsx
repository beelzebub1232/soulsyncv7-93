
import { useState, useEffect } from "react";
import { MessageSquare, Users, Plus, Filter, Search, Clock, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumPost, ForumCategory, ForumReply } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

export default function Community() {
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryId: "",
    isAnonymous: false
  });
  const { toast } = useToast();
  const { user } = useUser();
  
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
    
    // Load posts from storage or create sample posts if none exist
    const storedPosts = localStorage.getItem('soulsync_forum_posts');
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      setPosts(parsedPosts);
      setFilteredPosts(parsedPosts);
    } else {
      // Create sample posts for each category
      const samplePosts: ForumPost[] = generateSamplePosts(defaultCategories);
      setPosts(samplePosts);
      setFilteredPosts(samplePosts);
      localStorage.setItem('soulsync_forum_posts', JSON.stringify(samplePosts));
    }
  }, []);
  
  // Generate sample posts for categories
  const generateSamplePosts = (categories: ForumCategory[]): ForumPost[] => {
    const samplePosts: ForumPost[] = [];
    
    // Sample content for different categories
    const sampleContent = {
      anxiety: [
        {
          title: "Techniques for managing panic attacks",
          content: "I've been struggling with panic attacks recently. What techniques have helped you manage them in the moment?"
        },
        {
          title: "Social anxiety at work",
          content: "Does anyone have tips for managing social anxiety in workplace meetings? I find myself freezing up when I need to speak."
        },
        {
          title: "Physical symptoms of anxiety",
          content: "Lately I've been experiencing heart palpitations and shortness of breath. Does anyone else have physical symptoms with their anxiety?"
        }
      ],
      depression: [
        {
          title: "Getting out of bed on bad days",
          content: "Some days I can barely get out of bed. What small steps help you when depression is overwhelming?"
        },
        {
          title: "Depression and losing interest in hobbies",
          content: "I used to love painting but now I feel nothing when I try. Has anyone found a way to reconnect with their passions?"
        },
        {
          title: "Supporting a partner with depression",
          content: "My partner was recently diagnosed with depression. How can I best support them through this?"
        }
      ],
      mindfulness: [
        {
          title: "Beginning meditation practice",
          content: "I'm new to meditation and finding it difficult to quiet my mind. Any tips for beginners?"
        },
        {
          title: "Mindfulness exercises for work breaks",
          content: "Looking for quick mindfulness exercises I can do during short breaks at work. What works for you?"
        },
        {
          title: "Connecting mindfulness to daily activities",
          content: "How do you incorporate mindfulness into everyday tasks like cooking or cleaning?"
        }
      ],
      general: [
        {
          title: "Sleep hygiene tips",
          content: "I've been having trouble sleeping. What sleep hygiene practices have helped improve your sleep quality?"
        },
        {
          title: "Finding a therapist",
          content: "I'm ready to start therapy but unsure how to find the right therapist. What should I look for?"
        },
        {
          title: "Managing stress during major life changes",
          content: "I'm going through several big life changes at once. How do you manage stress during transitions?"
        }
      ]
    };
    
    // Generate 3 sample posts for each category
    const now = new Date();
    let postId = 1;
    
    categories.forEach(category => {
      const categorySamples = sampleContent[category.id as keyof typeof sampleContent] || [];
      
      categorySamples.forEach((sample, index) => {
        // Create post with varying dates (some recent, some older)
        const daysAgo = Math.floor(Math.random() * 14); // Random between 0-14 days ago
        const postDate = new Date(now);
        postDate.setDate(postDate.getDate() - daysAgo);
        
        const isAnonymous = index % 3 === 0; // Make some posts anonymous
        const replies = Math.floor(Math.random() * 15); // Random number of replies
        
        samplePosts.push({
          id: `sample-${postId++}`,
          title: sample.title,
          content: sample.content,
          categoryId: category.id,
          categoryName: category.name,
          author: isAnonymous ? "Anonymous" : `Community Member ${postId % 5 + 1}`,
          date: postDate,
          replies: replies,
          isAnonymous: isAnonymous
        });
      });
    });
    
    // Sort by date (newest first)
    return samplePosts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };
  
  // Filter and sort posts when search query, sort order, or category filter changes
  useEffect(() => {
    let filtered = posts;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.content.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(post => post.categoryId === selectedCategory);
    }
    
    // Apply sorting
    if (sortOrder === 'recent') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortOrder === 'popular') {
      filtered = [...filtered].sort((a, b) => b.replies - a.replies);
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, posts, sortOrder, selectedCategory]);
  
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
      author: newPost.isAnonymous ? "Anonymous" : (user?.username || "Current User"),
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
  
  // Function to open post dialog with pre-selected category
  const openNewPostWithCategory = (categoryId: string) => {
    setNewPost({...newPost, categoryId});
    setIsNewPostOpen(true);
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
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-mindscape-light focus:border-mindscape-primary"
          />
        </div>
        
        <Select 
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as 'recent' | 'popular')}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
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
              <Card 
                key={category.id}
                className={`hover:shadow-md transition-all border-l-4 ${category.color}`}
              >
                <CardContent className="p-4">
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
                  <div className="mt-3 flex justify-between items-center">
                    <Link 
                      to={`/community/${category.id}`}
                      className="text-sm text-mindscape-primary hover:underline"
                    >
                      View discussions
                    </Link>
                    <Button 
                      size="sm" 
                      onClick={() => openNewPostWithCategory(category.id)}
                      className="button-primary"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      New Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-mindscape-primary" />
              <span>Recent Discussions</span>
            </h2>
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
                <Card 
                  key={post.id}
                  className="hover:shadow-md transition-all"
                >
                  <CardContent className="p-4">
                    <Link to={`/community/post/${post.id}`}>
                      <h3 className="font-medium hover:text-mindscape-primary transition-colors">{post.title}</h3>
                    </Link>
                    
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                    
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-mindscape-primary border border-mindscape-light rounded-full px-2 py-0.5">
                          {post.categoryName}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {post.replies} replies
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatRelativeTime(post.date)}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs">
                      <div className="flex items-center gap-2">
                        {post.isAnonymous ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <span className="text-xs">?</span>
                            </div>
                            <span className="text-muted-foreground">Anonymous</span>
                          </>
                        ) : (
                          <>
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-muted-foreground">{post.author}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
