
import { Wind } from "lucide-react";
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
      icon={<Wind className="h-5 w-5" />}
      color="blue"
      message={title || "No breathing exercises match your filters"}
    />
  );
}
