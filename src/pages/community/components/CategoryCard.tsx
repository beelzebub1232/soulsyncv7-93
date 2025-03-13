
import { ForumCategory } from "@/types/community";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface CategoryCardProps {
  category: ForumCategory;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const getBorderColor = () => {
    return category.color || "border-mindscape-primary";
  };
  
  return (
    <Card 
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${getBorderColor()} border-l-4`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{category.icon}</div>
          <div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          <span>{category.posts}</span>
        </div>
      </div>
    </Card>
  );
}
