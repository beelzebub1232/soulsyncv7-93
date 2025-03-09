
import { useState, useEffect } from 'react';
import { ForumCategory, ForumPost } from "@/types/community";
import { generateSamplePosts } from '../utils/sampleDataGenerator';
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export const useCommunityData = () => {
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

  return {
    categories,
    posts,
    filteredPosts,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    selectedCategory,
    setSelectedCategory,
    newPost,
    setNewPost,
    isNewPostOpen,
    setIsNewPostOpen,
    handleCreatePost,
    openNewPostWithCategory
  };
};
