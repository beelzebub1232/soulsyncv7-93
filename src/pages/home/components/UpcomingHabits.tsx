
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Sample habits for demonstration
const sampleHabits = [
  {
    id: "1",
    title: "Meditation",
    time: "8:00 AM",
    completed: false,
    color: "border-green-400 bg-green-50/50",
    icon: "🧘‍♀️",
  },
  {
    id: "2",
    title: "Journaling",
    time: "9:30 AM",
    completed: true,
    color: "border-blue-400 bg-blue-50/50",
    icon: "📔",
  },
  {
    id: "3",
    title: "Take a walk",
    time: "6:00 PM",
    completed: false,
    color: "border-orange-400 bg-orange-50/50",
    icon: "🚶",
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
      <div className="card-primary p-5 text-center rounded-xl shadow-md">
        <p className="text-muted-foreground">No habits scheduled for today.</p>
        <Button className="button-primary mt-3">Add a Habit</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 rounded-xl overflow-hidden">
      {habits.map((habit) => (
        <div 
          key={habit.id} 
          className={cn(
            "card-primary p-4 flex items-center transition-all border-l-4 shadow-sm hover:shadow-md",
            habit.completed ? "border-green-400 bg-green-50/80" : habit.color
          )}
        >
          <button
            onClick={() => toggleHabit(habit.id)}
            className={cn(
              "w-7 h-7 rounded-full border flex items-center justify-center mr-4 transition-colors",
              habit.completed ? "bg-green-400 border-green-400" : "bg-white border-gray-300"
            )}
          >
            {habit.completed ? <Check className="h-4 w-4 text-white" /> : null}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center">
              <span className="mr-2 text-lg">{habit.icon}</span>
              <h3 className={cn(
                "font-medium transition-all",
                habit.completed ? "line-through text-muted-foreground" : ""
              )}>
                {habit.title}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{habit.time}</p>
          </div>
        </div>
      ))}
      
      <Button 
        className="w-full py-3 flex items-center justify-center gap-1 bg-mindscape-light/70 hover:bg-mindscape-light text-mindscape-tertiary rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add New Habit
      </Button>
    </div>
  );
}
