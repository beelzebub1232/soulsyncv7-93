
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumsList } from "./components/ForumsList";
import { DiscussionsList } from "./components/DiscussionsList";
import { NewPostDialog } from "./components/NewPostDialog";
import { useCommunityData } from "./hooks/useCommunityData";

export default function Community() {
  const {
    categories,
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
  } = useCommunityData();
  
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
          <ForumsList 
            categories={categories} 
            onNewPost={openNewPostWithCategory} 
          />
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-4 mt-4">
          <DiscussionsList 
            posts={filteredPosts} 
            onNewPost={() => setIsNewPostOpen(true)} 
          />
        </TabsContent>
      </Tabs>
      
      <NewPostDialog 
        isOpen={isNewPostOpen}
        setIsOpen={setIsNewPostOpen}
        formData={newPost}
        setFormData={setNewPost}
        categories={categories}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
