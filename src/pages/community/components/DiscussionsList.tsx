
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ForumPost } from "@/types/community";
import { PostCard } from './PostCard';
import { Button } from "@/components/ui/button";

interface DiscussionsListProps {
  posts: ForumPost[];
  onNewPost: () => void;
}

export const DiscussionsList: React.FC<DiscussionsListProps> = ({ posts, onNewPost }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-mindscape-primary" />
          <span>Recent Discussions</span>
        </h2>
      </div>
      
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="card-primary p-5 text-center">
            <p className="text-muted-foreground">No discussions found.</p>
            <Button 
              onClick={onNewPost} 
              className="button-primary mt-3"
            >
              Start a Discussion
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};
