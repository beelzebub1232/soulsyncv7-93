
import React from "react";
import { MessageSquare, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForumPost } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelativeTime } from "../utils/formatters";

interface CategoryDiscussionsProps {
  posts: ForumPost[];
  onNewPost: () => void;
}

export const CategoryDiscussions: React.FC<CategoryDiscussionsProps> = ({ posts, onNewPost }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-mindscape-primary" />
          <span>Discussions</span>
        </h2>
        
        <Button 
          className="button-primary flex items-center gap-1"
          onClick={onNewPost}
        >
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </Button>
      </div>
      
      {posts.length === 0 ? (
        <div className="card-primary p-5 text-center">
          <p className="text-muted-foreground">No discussions found in this category.</p>
          <Button 
            className="button-primary mt-3"
            onClick={onNewPost}
          >
            Start the First Discussion
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card 
              key={post.id}
              className="hover:shadow-md transition-all"
            >
              <CardContent className="p-4">
                <Link to={`/community/post/${post.id}`}>
                  <h3 className="font-medium hover:text-mindscape-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex justify-between items-center mt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-mindscape-primary">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.replies} replies</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatRelativeTime(post.date)}</span>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 text-xs">
                  {post.isAnonymous ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <span className="text-xs">?</span>
                      </div>
                      <span className="text-muted-foreground">Anonymous</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{post.author}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
