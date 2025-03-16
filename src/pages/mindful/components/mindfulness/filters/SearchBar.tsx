
import { Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function SearchBar({ onSearch, searchQuery = "", onSearchChange }: SearchBarProps) {
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      onSearch(value);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search exercises..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 w-full h-9 text-sm py-1"
        aria-label="Search mindfulness exercises"
      />
      {searchQuery && (
        <button
          onClick={() => handleSearchChange("")}
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
