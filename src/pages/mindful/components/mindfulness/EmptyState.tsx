
import { Flower } from "lucide-react";
import SharedEmptyState from "../shared/EmptyState";

interface EmptyStateProps {
  onClearFilters?: () => void;
  title?: string;
  description?: string;
}

export default function EmptyState({ onClearFilters, title, description }: EmptyStateProps) {
  if (title && description) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
          <Flower className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">{description}</p>
      </div>
    );
  }

  return (
    <SharedEmptyState 
      onClearFilters={onClearFilters} 
      icon={<Flower className="h-5 w-5" />}
      color="purple"
      message="No mindfulness exercises match your filters"
    />
  );
}
