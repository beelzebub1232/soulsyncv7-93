
import { ForumCategory } from "@/types/community";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: ForumCategory;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "card-primary block hover:shadow-md transition-all border-l-4 text-left w-full",
        category.color
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center text-xl">
          {category.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
          <div className="mt-1 text-xs text-mindscape-primary">
            {category.posts} {category.posts === 1 ? 'post' : 'posts'}
          </div>
        </div>
      </div>
    </button>
  );
}
