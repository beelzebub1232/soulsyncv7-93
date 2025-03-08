
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample habits for demonstration
const sampleHabits = [
  {
    id: "1",
    title: "Meditation",
    time: "8:00 AM",
    completed: false,
    color: "bg-mindscape-green",
  },
  {
    id: "2",
    title: "Journaling",
    time: "9:30 AM",
    completed: true,
    color: "bg-mindscape-blue",
  },
  {
    id: "3",
    title: "Take a walk",
    time: "6:00 PM",
    completed: false,
    color: "bg-mindscape-peach",
  },
];

export function UpcomingHabits() {
  const [habits, setHabits] = useState(sampleHabits);
  
  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };
  
  if (habits.length === 0) {
    return (
      <div className="card-primary p-5 text-center h-full flex flex-col justify-center">
        <p className="text-muted-foreground">No habits scheduled for today.</p>
        <button className="button-primary mt-3">Add a Habit</button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <div 
          key={habit.id} 
          className={cn(
            "card-primary p-4 flex items-center transition-all border-l-4",
            habit.completed ? "border-green-400 bg-green-50" : habit.color
          )}
        >
          <button
            onClick={() => toggleHabit(habit.id)}
            className={cn(
              "w-6 h-6 rounded-full border border-border flex items-center justify-center mr-3 transition-colors",
              habit.completed ? "bg-green-400 border-green-400" : "bg-white"
            )}
          >
            {habit.completed && <Check className="h-4 w-4 text-white" />}
          </button>
          
          <div className="flex-1">
            <h3 className={cn(
              "font-medium transition-all",
              habit.completed ? "line-through text-muted-foreground" : ""
            )}>
              {habit.title}
            </h3>
            <p className="text-xs text-muted-foreground">{habit.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
