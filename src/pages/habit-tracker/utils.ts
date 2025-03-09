
import { Habit } from "./types";

// Helper function to get color based on habit name
export const getColorForHabit = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("meditation") || lowerName.includes("yoga")) {
    return "bg-mindscape-blue border-blue-300";
  } else if (lowerName.includes("exercise") || lowerName.includes("workout")) {
    return "bg-mindscape-green border-green-300";
  } else if (lowerName.includes("read")) {
    return "bg-mindscape-yellow border-yellow-300";
  } else if (lowerName.includes("journal")) {
    return "bg-mindscape-peach border-orange-300";
  } else {
    return "bg-mindscape-pink border-pink-300";
  }
};

export const saveHabitToStorage = (userId: string, updatedHabits: any[]) => {
  const storageKey = `soulsync_habits_${userId}`;
  localStorage.setItem(storageKey, JSON.stringify(updatedHabits));
  
  // Dispatch storage event for other components
  const event = new StorageEvent('storage', {
    key: storageKey,
    newValue: JSON.stringify(updatedHabits),
    storageArea: localStorage
  });
  window.dispatchEvent(event);
};
