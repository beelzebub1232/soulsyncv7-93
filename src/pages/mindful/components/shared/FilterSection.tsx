
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterOption {
  label: string;
  value: string | null;
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  options: FilterOption[];
  activeFilter: string | null;
  onFilterChange: (value: string | null) => void;
}

export default function FilterSection({
  title,
  icon,
  options,
  activeFilter,
  onFilterChange,
}: FilterSectionProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2 pr-4">
          {options.map((filter) => (
            <Badge
              key={filter.label}
              variant={activeFilter === filter.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1 rounded-full flex-shrink-0",
                activeFilter === filter.value &&
                  "bg-mindscape-primary hover:bg-mindscape-primary/90"
              )}
              onClick={() => onFilterChange(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
