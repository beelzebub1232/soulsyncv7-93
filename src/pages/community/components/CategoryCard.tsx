
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ForumCategory } from "@/types/community";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: ForumCategory;
  onNewPost: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onNewPost }) => {
  return (
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
            onClick={() => onNewPost(category.id)}
            className="button-primary"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
