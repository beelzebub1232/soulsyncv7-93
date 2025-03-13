
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumCategory } from "@/types/community";
import { ForumCategoryList } from "./components/ForumCategoryList";
import { EmptyState } from "./components/EmptyState";
import { CommunityHeader } from "./components/CommunityHeader";
import { PendingVerifications } from "./components/PendingVerifications";
import { ReportedContent } from "./components/ReportedContent";

export default function Community() {
  const { user } = useUser();
  const [categories, setCategories] = useState<ForumCategory[]>([
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
  ]);

  // Count posts per category from localStorage
  useEffect(() => {
    const updateCategoryCounts = () => {
      const updatedCategories = [...categories];
      let needsUpdate = false;
      
      for (const category of updatedCategories) {
        const savedPosts = localStorage.getItem(`soulsync_posts_${category.id}`);
        if (savedPosts) {
          const posts = JSON.parse(savedPosts);
          if (posts.length !== category.posts) {
            category.posts = posts.length;
            needsUpdate = true;
          }
        } else {
          // Initialize empty array for this category if it doesn't exist
          localStorage.setItem(`soulsync_posts_${category.id}`, JSON.stringify([]));
        }
      }
      
      if (needsUpdate) {
        setCategories([...updatedCategories]); // Create new array reference to trigger re-render
      }
    };
    
    // Update counts immediately
    updateCategoryCounts();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', updateCategoryCounts);
    
    // Custom event for post updates
    window.addEventListener('postsUpdated', updateCategoryCounts);
    
    return () => {
      window.removeEventListener('storage', updateCategoryCounts);
      window.removeEventListener('postsUpdated', updateCategoryCounts);
    };
  }, [categories]);

  // Update counts when component mounts and periodically
  useEffect(() => {
    // Also update counts periodically to catch any changes
    const interval = setInterval(() => {
      const updatedCategories = [...categories];
      let needsUpdate = false;
      
      for (const category of updatedCategories) {
        const savedPosts = localStorage.getItem(`soulsync_posts_${category.id}`);
        if (savedPosts) {
          const posts = JSON.parse(savedPosts);
          if (posts.length !== category.posts) {
            category.posts = posts.length;
            needsUpdate = true;
          }
        }
      }
      
      if (needsUpdate) {
        setCategories([...updatedCategories]);
      }
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, [categories]);

  return (
    <div className="space-y-4 pb-16">
      <CommunityHeader />
      
      {user?.role === "admin" ? (
        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forum">Community Forum</TabsTrigger>
            <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
            <TabsTrigger value="reports">Reported Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forum" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Forum Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                {categories.length > 0 ? (
                  <ForumCategoryList categories={categories} />
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verifications" className="mt-4">
            <PendingVerifications />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <ReportedContent />
          </TabsContent>
        </Tabs>
      ) : user?.role === "professional" ? (
        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forum">Community Forum</TabsTrigger>
            <TabsTrigger value="reports">Reported Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forum" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Forum Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                {categories.length > 0 ? (
                  <ForumCategoryList categories={categories} />
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <ReportedContent />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="card-primary h-[calc(100vh-12rem)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Forum Categories</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 overflow-y-auto h-[calc(100%-5rem)]">
            {categories.length > 0 ? (
              <ForumCategoryList categories={categories} />
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
