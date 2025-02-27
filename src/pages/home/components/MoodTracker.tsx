
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { value: "amazing", label: "Amazing", emoji: "😁", color: "bg-green-100 border-green-300" },
  { value: "good", label: "Good", emoji: "🙂", color: "bg-blue-100 border-blue-300" },
  { value: "okay", label: "Okay", emoji: "😐", color: "bg-yellow-100 border-yellow-300" },
  { value: "sad", label: "Sad", emoji: "😔", color: "bg-orange-100 border-orange-300" },
  { value: "awful", label: "Awful", emoji: "😭", color: "bg-red-100 border-red-300" },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleMoodSelection = (value: string) => {
    setSelectedMood(value);
    toast({
      title: "Mood logged",
      description: `You're feeling ${value} today.`,
    });
  };
  
  return (
    <div className="card-highlight p-5">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">How are you feeling?</h2>
        <p className="text-sm text-muted-foreground">Track your mood daily</p>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelection(mood.value)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:scale-110",
              selectedMood === mood.value ? 
                `${mood.color} border-2 scale-110` : 
                "border border-transparent"
            )}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs mt-1 font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
