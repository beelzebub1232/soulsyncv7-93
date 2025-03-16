import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Clock } from "lucide-react";

interface FilterOption {
  label: string;
  value: string | null;
}

interface FilterSectionProps {
  difficultyFilter?: string[];
  durationFilter?: string[];
  onToggleDifficulty?: (difficulty: string) => void;
  onToggleDuration?: (duration: string) => void;
  title?: string;
  icon?: React.ReactNode;
  options?: FilterOption[];
  activeFilter?: string | null;
  onFilterChange?: (value: string | null) => void;
}

export default function FilterSection({
  difficultyFilter = [],
  durationFilter = [],
  onToggleDifficulty,
  onToggleDuration,
  title,
  icon,
  options,
  activeFilter,
  onFilterChange,
}: FilterSectionProps) {
  // If we're using the new API, use that
  if (title && icon && options && onFilterChange !== undefined) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ScrollArea className="pb-1 max-w-full">
          <div className="flex flex-wrap gap-2 pb-1">
            {options.map((filter) => (
              <Badge
                key={filter.label}
                variant={activeFilter === filter.value ? "default" : "outline"}
                className={cn(
                  "cursor-pointer rounded-full whitespace-nowrap text-xs py-0.5 px-2",
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

  // Otherwise use the old API
  return (
    <div className="flex flex-wrap gap-3">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">Focus Area</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <Badge
              key={level}
              variant={(difficultyFilter || []).includes(level) ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-xs py-0 h-6",
                (difficultyFilter || []).includes(level) && "bg-purple-500 hover:bg-purple-600"
              )}
              onClick={() => onToggleDifficulty && onToggleDifficulty(level)}
            >
              {level}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">Duration</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["5", "10", "15"].map((duration) => (
            <Badge
              key={duration}
              variant={(durationFilter || []).includes(duration) ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-xs py-0 h-6",
                (durationFilter || []).includes(duration) && "bg-purple-500 hover:bg-purple-600"
              )}
              onClick={() => onToggleDuration && onToggleDuration(duration)}
            >
              {duration} min
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
