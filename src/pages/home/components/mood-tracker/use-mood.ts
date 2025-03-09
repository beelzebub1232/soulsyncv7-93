
import { useState, useEffect } from "react";
import { MoodEntry, MoodValue } from "./types";
import { useUser } from "@/contexts/UserContext";

export function useMood() {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const { user } = useUser();
  
  // Function to get storage key based on user ID
  const getMoodStorageKey = () => {
    if (!user) return 'soulsync_moods';
    return `soulsync_moods_${user.id}`;
  };
  
  // Function to get today's mood from storage
  const getTodaysMood = (): MoodEntry | null => {
    if (!user) return null;
    
    const storageKey = getMoodStorageKey();
    const storedMoods = localStorage.getItem(storageKey);
    if (!storedMoods) return null;
    
    const moods: MoodEntry[] = JSON.parse(storedMoods);
    const today = new Date().toDateString();
    
    return moods.find(mood => new Date(mood.date).toDateString() === today) || null;
  };
  
  // Function to save mood to storage
  const saveMood = (mood: MoodValue, note?: string) => {
    if (!user) return;
    
    const newMoodEntry: MoodEntry = {
      value: mood,
      date: new Date(),
      note: note
    };
    
    const storageKey = getMoodStorageKey();
    const storedMoods = localStorage.getItem(storageKey);
    const moods: MoodEntry[] = storedMoods ? JSON.parse(storedMoods) : [];
    
    // Check if there's already an entry for today
    const todayIndex = moods.findIndex(
      mood => new Date(mood.date).toDateString() === new Date().toDateString()
    );
    
    if (todayIndex >= 0) {
      // Update today's entry
      moods[todayIndex] = newMoodEntry;
    } else {
      // Add new entry
      moods.push(newMoodEntry);
    }
    
    // Save the updated moods
    localStorage.setItem(storageKey, JSON.stringify(moods));
    
    // Dispatch a storage event so other components can update
    const event = new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(moods),
      oldValue: storedMoods || null,
      storageArea: localStorage
    });
    window.dispatchEvent(event);
  };
  
  // Load today's mood when component mounts or user changes
  useEffect(() => {
    const todaysMood = getTodaysMood();
    if (todaysMood) {
      setSelectedMood(todaysMood.value);
      setMoodNote(todaysMood.note || "");
    } else {
      // Reset state if no mood found for today (e.g., after user changes)
      setSelectedMood(null);
      setMoodNote("");
    }
  }, [user?.id]);

  return {
    selectedMood,
    setSelectedMood,
    moodNote,
    setMoodNote,
    saveMood
  };
}
