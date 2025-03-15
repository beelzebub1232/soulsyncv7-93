
import SharedSearchBar from "../../shared/SearchBar";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <SharedSearchBar 
      searchQuery={searchQuery} 
      onSearchChange={onSearchChange} 
      placeholder="Search mindfulness exercises..." 
    />
  );
}
