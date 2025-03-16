
import { Flower } from "lucide-react";
import SharedEmptyState from "../shared/EmptyState";
import { EmptyStateProps } from "../../types";

interface ExtendedEmptyStateProps extends EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ 
  onClearFilters, 
  title,
  description 
}: ExtendedEmptyStateProps) {
  return (
    <SharedEmptyState 
      onClearFilters={onClearFilters} 
      icon={<Flower className="h-5 w-5" />}
      color="purple"
      message={title || "No mindfulness exercises match your filters"}
    />
  );
}
