
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "./types";
import { getColorForHabit, saveHabitToStorage } from "./utils";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user } = useUser();
  const { toast } = useToast();

  // Load habits from localStorage
  useEffect(() => {
    if (!user) return;
    
    const loadHabits = () => {
      const storageKey = `soulsync_habits_${user.id}`;
      const storedHabits = localStorage.getItem(storageKey);
      
      if (storedHabits) {
        try {
          // Parse the habits from localStorage
          const parsedHabits = JSON.parse(storedHabits);
          
          // Group habits by name to calculate completion stats
          const habitGroups: Record<string, any[]> = {};
          parsedHabits.forEach((habit: any) => {
            if (!habitGroups[habit.name]) {
              habitGroups[habit.name] = [];
            }
            habitGroups[habit.name].push(habit);
          });
          
          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayString = today.toISOString().split('T')[0];
          
          // Convert to the format expected by the UI
          const formattedHabits: Habit[] = Object.entries(habitGroups).map(([name, entries]) => {
            // Find today's entry if it exists
            const todayEntry = entries.find((entry) => {
              const entryDate = new Date(entry.date);
              entryDate.setHours(0, 0, 0, 0);
              return entryDate.toISOString().split('T')[0] === todayString;
            });
            
            // Calculate days completed
            const completedEntries = entries.filter(entry => entry.completed);
            
            // Find a color from existing entries or assign default
            const habitColor = entries.find(entry => entry.color)?.color || getColorForHabit(name);
            
            // Get target days from a random entry (they should all have the same target)
            const targetDays = entries[0]?.targetDays || 7;
            
            return {
              id: todayEntry?.id || `${name}-${Date.now()}`,
              title: name,
              time: todayEntry?.time || "9:00 AM",
              completed: todayEntry?.completed || false,
              color: habitColor,
              daysCompleted: completedEntries.length,
              totalDays: targetDays
            };
          });
          
          setHabits(formattedHabits);
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
    
    // Update UI state
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const completed = !habit.completed;
        return { 
          ...habit, 
          completed,
          daysCompleted: completed ? habit.daysCompleted + 1 : Math.max(0, habit.daysCompleted - 1)
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    
    // Update localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        const habitToUpdate = allHabits.find((h: any) => h.id === id);
        
        if (habitToUpdate) {
          habitToUpdate.completed = !habitToUpdate.completed;
          saveHabitToStorage(user.id, allHabits);
          
          // Show a toast
          const targetHabit = updatedHabits.find(h => h.id === id);
          if (targetHabit) {
            toast({
              title: targetHabit.completed ? "Habit completed!" : "Habit uncompleted",
              description: targetHabit.completed 
                ? `Great job completing your ${targetHabit.title} habit!`
                : `You've marked ${targetHabit.title} as not completed.`,
            });
          }
        }
      } catch (error) {
        console.error("Failed to update habits:", error);
      }
    } else {
      // No habits stored yet, create new entry
      const today = new Date().toISOString();
      const habit = habits.find(h => h.id === id);
      
      if (habit) {
        const newHabitEntry = [{
          id,
          name: habit.title,
          date: today,
          completed: habit.completed,
          targetDays: habit.totalDays,
          time: habit.time,
          color: habit.color
        }];
        
        saveHabitToStorage(user.id, newHabitEntry);
      }
    }
  };

  const addNewHabit = (newHabit: { title: string; time: string; color: string }) => {
    if (!user) return;
    if (!newHabit.title || !newHabit.time) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and time for your habit.",
      });
      return;
    }
    
    const id = Date.now().toString();
    const today = new Date().toISOString();
    
    // Add to UI state
    const habit: Habit = {
      id,
      title: newHabit.title,
      time: newHabit.time,
      completed: false,
      color: newHabit.color,
      daysCompleted: 0,
      totalDays: 7, // Default to weekly goal
    };
    
    setHabits([...habits, habit]);
    
    // Add to localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    const newHabitEntry = {
      id,
      name: newHabit.title,
      date: today,
      completed: false,
      targetDays: 7,
      time: newHabit.time,
      color: newHabit.color
    };
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        saveHabitToStorage(user.id, [...allHabits, newHabitEntry]);
      } catch (error) {
        console.error("Failed to parse existing habits:", error);
        saveHabitToStorage(user.id, [newHabitEntry]);
      }
    } else {
      saveHabitToStorage(user.id, [newHabitEntry]);
    }
    
    toast({
      title: "Habit created",
      description: `You've added "${habit.title}" to your habits.`,
    });
    
    return habit;
  };
  
  const updateHabit = (editingHabit: Habit) => {
    if (!user) return;
    
    // Update UI state
    setHabits(
      habits.map((habit) => 
        habit.id === editingHabit.id ? editingHabit : habit
      )
    );
    
    // Update in localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        
        // Find any entries with this habit name and update them
        const updatedHabits = allHabits.map((habit: any) => {
          if (habit.id === editingHabit.id) {
            return {
              ...habit,
              name: editingHabit.title,
              time: editingHabit.time,
              color: editingHabit.color
            };
          }
          return habit;
        });
        
        saveHabitToStorage(user.id, updatedHabits);
      } catch (error) {
        console.error("Failed to update habit:", error);
      }
    }
    
    toast({
      title: "Habit updated",
      description: `Changes to "${editingHabit.title}" have been saved.`,
    });
  };
  
  const deleteHabit = (id: string) => {
    if (!user) return;
    
    // Get the habit title before removing
    const habitToDelete = habits.find(habit => habit.id === id);
    
    // Update UI state
    setHabits(habits.filter(habit => habit.id !== id));
    
    // Update localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits && habitToDelete) {
      try {
        const allHabits = JSON.parse(storedHabits);
        
        // Remove habit with this id and also any entries with the same name
        const updatedHabits = allHabits.filter((habit: any) => 
          habit.id !== id && habit.name !== habitToDelete.title
        );
        
        saveHabitToStorage(user.id, updatedHabits);
      } catch (error) {
        console.error("Failed to delete habit:", error);
      }
    }
    
    toast({
      title: "Habit deleted",
      description: habitToDelete 
        ? `"${habitToDelete.title}" has been removed from your habits.`
        : "The habit has been removed from your list.",
    });
  };

  return {
    habits,
    toggleHabit,
    addNewHabit,
    updateHabit,
    deleteHabit
  };
}
