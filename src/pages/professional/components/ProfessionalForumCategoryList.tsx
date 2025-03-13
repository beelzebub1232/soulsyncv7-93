
import { Card } from "@/components/ui/card";
import { ForumCategory } from "@/types/community";
import { Heart, MessageCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ForumCategoryListProps {
  categories: ForumCategory[];
}

export function ProfessionalForumCategoryList({ categories }: ForumCategoryListProps) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="overflow-hidden border-border/60 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/professional/community/category/${category.id}`)}
        >
          <div className="flex items-center p-4">
            <div className={cn("p-2 rounded-md mr-4", category.color)}>
              <Heart className="h-5 w-5 text-foreground/80" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{category.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {category.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-muted-foreground">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{category.posts}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 px-4 py-2">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <span className="font-medium">Professional:</span> You can provide expert guidance in this category
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
