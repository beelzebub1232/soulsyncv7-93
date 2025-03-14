
import { Wind, XCircle } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
      <div className="w-16 h-16 rounded-full bg-mindscape-light/30 flex items-center justify-center mb-3">
        <Wind className="h-8 w-8 text-mindscape-primary opacity-70" />
      </div>
      <p className="mb-3">No exercises match your filters</p>
      <button 
        className="text-mindscape-primary flex items-center gap-1 px-4 py-2 rounded-full bg-mindscape-light/30 text-sm"
        onClick={onClearFilters}
      >
        <XCircle className="h-4 w-4" />
        Clear all filters
      </button>
    </div>
  );
}
