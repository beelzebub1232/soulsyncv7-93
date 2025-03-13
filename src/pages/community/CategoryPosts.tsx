
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ForumPost, ForumCategory } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Heart, MessageSquare, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import { useNotification } from "@/contexts/NotificationContext";
import { NewPostSheet } from "./components/NewPostSheet";
import { PostItem } from "./components/PostItem";

export default function CategoryPosts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useUser();
  const { addNotification } = useNotification();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  
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
        icon: "heart",
        posts: 18,
        color: "bg-purple-100"
      },
      {
        id: "mindfulness",
        name: "Mindfulness",
        description: "Share mindfulness practices and meditation techniques",
        icon: "heart",
        posts: 32,
        color: "bg-green-100"
      }
    ];
    
    const foundCategory = mockCategories.find(c => c.id === categoryId);
    setCategory(foundCategory || null);
  }, [categoryId]);
  
  // Simulate loading posts for this category
  useEffect(() => {
    if (categoryId) {
      // This would be a real API call in a production app
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
          replies: 5,
          isAnonymous: true,
          likes: 12
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
          replies: 8,
          isAnonymous: false,
          likes: 24
        }
      ];
      
      setPosts(mockPosts);
    }
  }, [categoryId, category]);
  
  if (!category) {
    return <div>Loading...</div>;
  }
  
  const handleNewPost = (post: ForumPost) => {
    setPosts(prev => [post, ...prev]);
    setIsNewPostOpen(false);
    
    // Create notification for all users except the author
    if (user && user.role === 'professional') {
      addNotification({
        type: 'post',
        message: `Professional ${user.username} posted in ${category.name}`,
        // In a real app, this would be sent to relevant users
      });
    }
  };
  
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <Link to="/community" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
        
        <Button 
          className="button-primary"
          onClick={() => setIsNewPostOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Post
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{category.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </CardHeader>
        <CardContent>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostItem key={post.id} post={post} />
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
