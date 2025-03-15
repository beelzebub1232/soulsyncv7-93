
import React from "react";
import { XCircle } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
  icon: React.ReactNode;
  message?: string;
}

export default function EmptyState({ 
  onClearFilters, 
  icon, 
  message = "No exercises match your filters" 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
      <div className="mb-2 opacity-50">
        {icon}
      </div>
      <p>{message}</p>
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
