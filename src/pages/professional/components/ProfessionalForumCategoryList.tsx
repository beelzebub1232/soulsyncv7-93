
import { ForumCategory } from "@/types/community";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProfessionalForumCategoryListProps {
  categories: ForumCategory[];
}

export function ProfessionalForumCategoryList({ categories }: ProfessionalForumCategoryListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/10 cursor-pointer transition-colors"
          onClick={() => navigate(`/professional/community/category/${category.id}`)}
        >
          <div className={cn("p-2 rounded-md flex-shrink-0", "bg-primary/10")}>
            <Heart className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{category.name}</h3>
              <span className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
                {category.posts} posts
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
