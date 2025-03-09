
import { useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { useForumCategory } from "./hooks/useForumCategory";
import { CategoryHeader } from "./components/CategoryHeader";
import { CategorySearchFilter } from "./components/CategorySearchFilter";
import { CategoryDiscussions } from "./components/CategoryDiscussions";
import { CreatePostDialog } from "./components/CreatePostDialog";
import NotFound from "../NotFound";

export default function ForumCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const {
    category,
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
  } = useForumCategory(categoryId);
  
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
      <CategoryHeader category={category} />
      
      <CategorySearchFilter
        categoryName={category.name}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      
      <CategoryDiscussions 
        posts={displayedPosts}
        onNewPost={() => setIsNewPostOpen(true)}
      />
      
      <CreatePostDialog
        isOpen={isNewPostOpen}
        setIsOpen={setIsNewPostOpen}
        categoryName={category.name}
        newPost={newPost}
        setNewPost={setNewPost}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
}
