
import { Heart, ChevronRight } from "lucide-react";
import { ForumCategory } from "@/types/community";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ForumCategoryListProps {
  categories: ForumCategory[];
}

export function ForumCategoryList({ categories }: ForumCategoryListProps) {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <Link 
          to={`/community/category/${category.id}`}
          key={category.id}
          className="block card-primary p-4 transition-all hover:shadow-md"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", category.color)}>
                <Heart className="h-5 w-5 text-mindscape-primary" />
              </div>
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{category.posts} posts</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
