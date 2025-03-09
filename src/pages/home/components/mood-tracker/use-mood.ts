
import { useState, useEffect } from "react";
import { MoodEntry, MoodValue } from "./types";

export function useMood() {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodNote, setMoodNote] = useState("");
  
  // Function to get today's mood from storage
  const getTodaysMood = (): MoodEntry | null => {
    const storedMoods = localStorage.getItem('soulsync_moods');
    if (!storedMoods) return null;
    
    const moods: MoodEntry[] = JSON.parse(storedMoods);
    const today = new Date().toDateString();
    
    return moods.find(mood => new Date(mood.date).toDateString() === today) || null;
  };
  
  // Function to save mood to storage
  const saveMood = (mood: MoodValue, note?: string) => {
    const newMoodEntry: MoodEntry = {
      value: mood,
      date: new Date(),
      note: note
    };
    
    const storedMoods = localStorage.getItem('soulsync_moods');
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
    
    localStorage.setItem('soulsync_moods', JSON.stringify(moods));
  };
  
  // Load today's mood when component mounts
  useEffect(() => {
    const todaysMood = getTodaysMood();
    if (todaysMood) {
      setSelectedMood(todaysMood.value);
      setMoodNote(todaysMood.note || "");
    }
  }, []);

  return {
    selectedMood,
    setSelectedMood,
    moodNote,
    setMoodNote,
    saveMood
  };
}
