
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ForumCategory } from "@/types/community";

interface CategoryHeaderProps {
  category: ForumCategory;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category }) => {
  return (
    <header>
      <Link to="/community" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Forums
      </Link>
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-mindscape-light">
          {category.icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
          <p className="text-sm mt-1 text-mindscape-primary">{category.posts} posts</p>
        </div>
      </div>
    </header>
  );
};
