
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Plus, Filter, Search, Bell, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumPost, ForumCategory, ProfessionalVerificationRequest } from "@/types/community";
import { NewPostDialog } from "./components/NewPostDialog";
import { CategoryCard } from "./components/CategoryCard";
import { PostCard } from "./components/PostCard";
import { AdminPanel } from "./components/AdminPanel";
import { ProfessionalVerificationForm } from "./components/ProfessionalVerificationForm";

export default function Community() {
  const [activeTab, setActiveTab] = useState<string>("forums");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isProfessionalFormOpen, setIsProfessionalFormOpen] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Initialize default categories and posts
  useEffect(() => {
    // Default categories
    const defaultCategories: ForumCategory[] = [
      {
        id: "anxiety",
        name: "Anxiety Support",
        description: "Share coping strategies and support for anxiety",
        icon: "😰",
        posts: 0,
        color: "border-yellow-300"
      },
      {
        id: "depression",
        name: "Depression Support",
        description: "A safe space to discuss depression and find support",
        icon: "😔",
        posts: 0,
        color: "border-blue-300"
      },
      {
        id: "mindfulness",
        name: "Mindfulness Practice",
        description: "Discussions about meditation and mindfulness techniques",
        icon: "🧘",
        posts: 0,
        color: "border-green-300"
      },
      {
        id: "general",
        name: "General Wellness",
        description: "General discussions about mental wellbeing",
        icon: "💜",
        posts: 0,
        color: "border-purple-300"
      },
      {
        id: "selfcare",
        name: "Self-Care",
        description: "Tips and discussions on self-care practices",
        icon: "🌱",
        posts: 0,
        color: "border-green-400"
      },
      {
        id: "relationships",
        name: "Relationships",
        description: "Support for navigating relationships and social anxiety",
        icon: "❤️",
        posts: 0,
        color: "border-red-300"
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
      setFilteredPosts(sortPosts(parsedPosts, sortOrder));
    }
  }, [sortOrder]);
  
  // Filter and sort posts when search query or sort order changes
  useEffect(() => {
    let filtered = posts;
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = posts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.content.toLowerCase().includes(lowerQuery) ||
        post.categoryName.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredPosts(sortPosts(filtered, sortOrder));
  }, [searchQuery, posts, sortOrder]);
  
  const sortPosts = (postsToSort: ForumPost[], order: 'recent' | 'popular') => {
    if (order === 'recent') {
      return [...postsToSort].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      return [...postsToSort].sort((a, b) => 
        (b.likes + b.replies) - (a.likes + a.replies)
      );
    }
  };
  
  const handleCreatePost = (newPost: ForumPost) => {
    // Update posts
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
    
    // Update category post count
    const updatedCategories = categories.map(c => 
      c.id === newPost.categoryId ? { ...c, posts: c.posts + 1 } : c
    );
    setCategories(updatedCategories);
    localStorage.setItem('soulsync_forum_categories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Post created",
      description: "Your post has been published to the community."
    });
  };
  
  const handleSortChange = (order: 'recent' | 'popular') => {
    setSortOrder(order);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Reset search when changing tabs
    setSearchQuery("");
  };
  
  const handlePostClick = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/community/category/${categoryId}`);
  };
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Community</h1>
          <p className="text-muted-foreground">Support forums and discussions</p>
        </div>
        
        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setActiveTab('admin')}
              className={activeTab === 'admin' ? 'bg-mindscape-light' : ''}
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-mindscape-primary text-[10px] text-white">
              3
            </span>
          </Button>
          
          <Button 
            onClick={() => setIsNewPostOpen(true)}
            className="w-10 h-10 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
            aria-label="New Discussion"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
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
        
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-lg"
          aria-label="Filter"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          {user?.role === 'admin' && (
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="forums" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-mindscape-primary" />
              <span>Support Forums</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-mindscape-primary" />
              <span>Recent Discussions</span>
            </h2>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={sortOrder === 'recent' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('recent')}
                className="text-xs"
              >
                Recent
              </Button>
              <Button 
                variant={sortOrder === 'popular' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('popular')}
                className="text-xs"
              >
                Popular
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="card-primary p-5 text-center">
                <p className="text-muted-foreground">No discussions found.</p>
                <Button 
                  onClick={() => setIsNewPostOpen(true)} 
                  className="button-primary mt-3"
                >
                  Start a Discussion
                </Button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => handlePostClick(post.id)}
                  currentUser={user}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        {user?.role === 'admin' && (
          <TabsContent value="admin" className="space-y-4 mt-4">
            <AdminPanel />
          </TabsContent>
        )}
      </Tabs>
      
      {/* New Post Dialog */}
      <NewPostDialog 
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onCreatePost={handleCreatePost}
        categories={categories}
        currentUser={user}
      />
      
      {/* Professional Verification Form */}
      {user?.role === 'professional' && !user.isVerified && (
        <ProfessionalVerificationForm
          isOpen={isProfessionalFormOpen}
          onClose={() => setIsProfessionalFormOpen(false)}
        />
      )}
      
      <div className="text-center pt-4">
        {user?.role === 'professional' && !user.isVerified ? (
          <Button 
            onClick={() => setIsProfessionalFormOpen(true)}
            className="button-primary"
          >
            Complete Professional Verification
          </Button>
        ) : (
          <Button 
            onClick={() => setIsNewPostOpen(true)}
            className="button-primary"
          >
            Start a Discussion
          </Button>
        )}
      </div>
    </div>
  );
}
