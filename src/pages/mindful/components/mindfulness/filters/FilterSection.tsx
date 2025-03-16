
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterSectionProps } from "../../../types";
import { Clock, Flower } from "lucide-react";

// Adapter component that takes the old props format and maps it to the new one
export default function FilterSection({
  difficultyFilter,
  durationFilter,
  onToggleDifficulty,
  onToggleDuration,
  title,
  icon,
  options,
  activeFilter,
  onFilterChange,
}: FilterSectionProps & {
  difficultyFilter?: string[];
  durationFilter?: string[];
  onToggleDifficulty?: (difficulty: string) => void;
  onToggleDuration?: (duration: string) => void;
}) {
  // Handle both new and old API
  if (difficultyFilter !== undefined && durationFilter !== undefined) {
    return (
      <div className="space-y-4">
        <DifficultyFilter 
          difficultyFilter={difficultyFilter} 
          onToggleDifficulty={onToggleDifficulty || (() => {})} 
        />
        <DurationFilter 
          durationFilter={durationFilter} 
          onToggleDuration={onToggleDuration || (() => {})} 
        />
      </div>
    );
  }
  
  // New API
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ScrollArea className="pb-1 max-w-full">
        <div className="flex flex-wrap gap-2 pb-1">
          {options?.map((filter) => (
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

// Subcomponents to maintain backward compatibility
function DifficultyFilter({ difficultyFilter, onToggleDifficulty }: { 
  difficultyFilter: string[], 
  onToggleDifficulty: (difficulty: string) => void 
}) {
  const difficultyOptions = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" }
  ];
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Flower className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Difficulty</span>
      </div>
      <ScrollArea className="pb-1">
        <div className="flex gap-2 pb-1">
          {difficultyOptions.map((option) => (
            <Badge
              key={option.value}
              variant={difficultyFilter.includes(option.value) ? "default" : "outline"}
              className={cn(
                "cursor-pointer rounded-full whitespace-nowrap",
                difficultyFilter.includes(option.value) &&
                  "bg-mindscape-primary hover:bg-mindscape-primary/90"
              )}
              onClick={() => onToggleDifficulty(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function DurationFilter({ durationFilter, onToggleDuration }: { 
  durationFilter: string[], 
  onToggleDuration: (duration: string) => void 
}) {
  const durationOptions = [
    { label: "< 5 min", value: "short" },
    { label: "5-15 min", value: "medium" },
    { label: "> 15 min", value: "long" }
  ];
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Duration</span>
      </div>
      <ScrollArea className="pb-1">
        <div className="flex gap-2 pb-1">
          {durationOptions.map((option) => (
            <Badge
              key={option.value}
              variant={durationFilter.includes(option.value) ? "default" : "outline"}
              className={cn(
                "cursor-pointer rounded-full whitespace-nowrap",
                durationFilter.includes(option.value) &&
                  "bg-mindscape-primary hover:bg-mindscape-primary/90"
              )}
              onClick={() => onToggleDuration(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
