
import { useState, useEffect } from "react";
import { ForumCategory, ForumPost } from "@/types/community";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export function useForumCategory(categoryId: string | undefined) {
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

  return {
    category,
    posts,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    isLoading,
    isNewPostOpen,
    setIsNewPostOpen,
    newPost,
    setNewPost,
    handleCreatePost,
    filteredAndSortedPosts
  };
}
