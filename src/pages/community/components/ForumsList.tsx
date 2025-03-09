
import React from 'react';
import { Users } from 'lucide-react';
import { ForumCategory } from "@/types/community";
import { CategoryCard } from './CategoryCard';

interface ForumsListProps {
  categories: ForumCategory[];
  onNewPost: (categoryId: string) => void;
}

export const ForumsList: React.FC<ForumsListProps> = ({ categories, onNewPost }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-mindscape-primary" />
          <span>Support Forums</span>
        </h2>
      </div>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            onNewPost={onNewPost} 
          />
        ))}
      </div>
    </div>
  );
};
