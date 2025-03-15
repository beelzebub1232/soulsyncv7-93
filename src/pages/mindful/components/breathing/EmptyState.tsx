
import { Wind } from "lucide-react";
import SharedEmptyState from "../shared/EmptyState";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return <SharedEmptyState onClearFilters={onClearFilters} icon={Wind} />;
}
