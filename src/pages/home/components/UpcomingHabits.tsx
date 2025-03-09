
import { useState, useEffect } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  time?: string;
  completed: boolean;
  color: string;
  icon: string;
  date: string;
  targetDays: number;
}

export function UpcomingHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Icons for different habit types
  const habitIcons: Record<string, string> = {
    "meditation": "🧘‍♀️",
    "exercise": "🏃‍♂️",
    "reading": "📚",
    "journaling": "📔",
    "water": "💧",
    "walking": "🚶",
    "sleep": "😴",
    "stretching": "🤸‍♂️",
    "vitamins": "💊"
  };
  
  // Colors for different habit types
  const habitColors: Record<string, string> = {
    "meditation": "border-blue-400 bg-blue-50/50",
    "exercise": "border-green-400 bg-green-50/50",
    "reading": "border-purple-400 bg-purple-50/50",
    "journaling": "border-indigo-400 bg-indigo-50/50",
    "water": "border-cyan-400 bg-cyan-50/50",
    "walking": "border-orange-400 bg-orange-50/50",
    "sleep": "border-blue-300 bg-blue-50/50",
    "stretching": "border-yellow-400 bg-yellow-50/50",
    "vitamins": "border-pink-400 bg-pink-50/50"
  };
  
  // Get a color and icon for a habit
  const getHabitDisplayProps = (name: string) => {
    const lowerName = name.toLowerCase();
    let icon = "✨";
    let color = "border-gray-400 bg-gray-50/50";
    
    // Find matching icons and colors
    Object.keys(habitIcons).forEach(key => {
      if (lowerName.includes(key)) {
        icon = habitIcons[key];
        color = habitColors[key];
      }
    });
    
    return { icon, color };
  };
  
  useEffect(() => {
    if (!user) return;
    
    const loadHabits = () => {
      const storageKey = `soulsync_habits_${user.id}`;
      const storedHabits = localStorage.getItem(storageKey);
      
      if (storedHabits) {
        try {
          const allHabits = JSON.parse(storedHabits);
          
          // Group by name and get today's habits
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const todayString = today.toISOString().split('T')[0];
          
          const habitsForToday = allHabits
            .filter((habit: any) => {
              const habitDate = new Date(habit.date);
              habitDate.setHours(0, 0, 0, 0);
              return habitDate.toISOString().split('T')[0] === todayString;
            })
            .map((habit: any) => {
              const { icon, color } = getHabitDisplayProps(habit.name);
              
              // Generate a time based on habit name
              let time = '';
              if (habit.name.toLowerCase().includes('morning') || habit.name.toLowerCase().includes('wake')) {
                time = '8:00 AM';
              } else if (habit.name.toLowerCase().includes('evening') || habit.name.toLowerCase().includes('night')) {
                time = '7:00 PM';
              } else if (habit.name.toLowerCase().includes('lunch') || habit.name.toLowerCase().includes('noon')) {
                time = '12:00 PM';
              } else {
                // Random time between 8 AM and 8 PM
                const hour = Math.floor(Math.random() * 12) + 8;
                time = `${hour > 12 ? hour - 12 : hour}:${Math.random() > 0.5 ? '00' : '30'} ${hour >= 12 ? 'PM' : 'AM'}`;
              }
              
              return {
                ...habit,
                icon,
                color,
                time
              };
            });
          
          setHabits(habitsForToday);
        } catch (error) {
          console.error("Failed to parse habits:", error);
          setHabits([]);
        }
      }
    };
    
    loadHabits();
    
    // Listen for storage events to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `soulsync_habits_${user.id}`) {
        loadHabits();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);
  
  const toggleHabit = (id: string) => {
    if (!user) return;
    
    // First update the UI
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    
    // Then update localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        const updated = allHabits.map((habit: any) => 
          habit.id === id ? { ...habit, completed: !habit.completed } : habit
        );
        
        localStorage.setItem(storageKey, JSON.stringify(updated));
        
        // Dispatch a storage event for other components
        const event = new StorageEvent('storage', {
          key: storageKey,
          newValue: JSON.stringify(updated),
          oldValue: storedHabits,
          storageArea: localStorage
        });
        window.dispatchEvent(event);
        
        // Show a toast
        const targetHabit = updatedHabits.find(h => h.id === id);
        if (targetHabit) {
          toast({
            title: targetHabit.completed ? "Habit completed!" : "Habit uncompleted",
            description: targetHabit.completed 
              ? `Great job completing your ${targetHabit.name} habit!`
              : `You've marked ${targetHabit.name} as not completed.`,
          });
        }
      } catch (error) {
        console.error("Failed to update habits:", error);
      }
    }
  };
  
  if (habits.length === 0) {
    return (
      <div className="card-primary p-5 text-center rounded-xl shadow-md">
        <p className="text-muted-foreground">No habits scheduled for today.</p>
        <Button 
          className="button-primary mt-3"
          onClick={() => navigate('/habit-tracker')}
        >
          Add a Habit
        </Button>
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
                {habit.name}
              </h3>
            </div>
            {habit.time && (
              <p className="text-xs text-muted-foreground mt-1">{habit.time}</p>
            )}
          </div>
        </div>
      ))}
      
      <Button 
        className="w-full py-3 flex items-center justify-center gap-1 bg-mindscape-light/70 hover:bg-mindscape-light text-mindscape-tertiary rounded-lg transition-colors"
        onClick={() => navigate('/habit-tracker')}
      >
        <Plus className="h-4 w-4" />
        Add New Habit
      </Button>
    </div>
  );
}
