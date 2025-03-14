
import { Flower, XCircle } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
      <Flower className="h-10 w-10 mb-2 opacity-50" />
      <p>No exercises match your filters</p>
      <button 
        className="text-mindscape-primary underline mt-2 flex items-center gap-1"
        onClick={onClearFilters}
      >
        <XCircle className="h-4 w-4" />
        Clear all filters
      </button>
    </div>
  );
}
