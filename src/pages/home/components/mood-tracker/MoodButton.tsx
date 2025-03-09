
import { cn } from "@/lib/utils";
import { Mood } from "./types";

interface MoodButtonProps {
  mood: Mood;
  isSelected: boolean;
  onClick: () => void;
}

export function MoodButton({ mood, isSelected, onClick }: MoodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:scale-110",
        isSelected ? 
          `${mood.bgColor} border-2 scale-110` : 
          "border border-transparent"
      )}
    >
      <div className={cn("transition-colors", mood.color, isSelected ? "animate-bounce-soft" : "")}>
        {mood.icon}
      </div>
      <span className="text-xs mt-1 font-medium">{mood.label}</span>
    </button>
  );
}
