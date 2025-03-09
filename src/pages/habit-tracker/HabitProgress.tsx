
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Habit } from "./types";
import { useUser } from "@/contexts/UserContext";

interface HabitProgressProps {
  habit: Habit;
}

export function HabitProgress({ habit }: HabitProgressProps) {
  const { user } = useUser();
  
  // Ensure we only display data for the current user
  if (!user) {
    return null;
  }
  
  const getProgressColor = (colorString: string) => {
    if (colorString.includes("green")) return "bg-green-500";
    if (colorString.includes("blue")) return "bg-blue-500";
    if (colorString.includes("yellow")) return "bg-yellow-500";
    if (colorString.includes("orange")) return "bg-orange-500";
    return "bg-pink-500";
  };

  return (
    <div className="card-primary p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{habit.title}</h3>
        <span className="text-sm text-mindscape-primary font-medium">
          {habit.daysCompleted}/{habit.totalDays} days
        </span>
      </div>
      
      <Progress 
        value={(habit.daysCompleted / habit.totalDays) * 100} 
        className="h-2.5"
        indicatorClassName={getProgressColor(habit.color)}
      />
    </div>
  );
}
