
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {options.map((filter) => (
          <Badge
            key={filter.label}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className={cn(
              "cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full text-xs border-border/60",
              "flex-shrink-0 transition-all",
              activeFilter === filter.value
                ? "bg-mindscape-primary hover:bg-mindscape-primary/90"
                : "bg-background/80 hover:bg-background/60"
            )}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
