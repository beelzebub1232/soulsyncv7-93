
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySearchFilterProps {
  categoryName: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: 'recent' | 'popular';
  setSortOrder: (order: 'recent' | 'popular') => void;
}

export const CategorySearchFilter: React.FC<CategorySearchFilterProps> = ({
  categoryName,
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search in ${categoryName}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 border-mindscape-light focus:border-mindscape-primary"
        />
      </div>
      
      <Select 
        value={sortOrder}
        onValueChange={(value) => setSortOrder(value as 'recent' | 'popular')}
      >
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
