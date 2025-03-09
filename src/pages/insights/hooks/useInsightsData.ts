
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';

interface WeeklySummary {
  moodAverage: string;
  journalEntries: number;
  completedHabits: string;
  mindfulnessMinutes: number;
}

interface InsightsData {
  recentMoods: MoodEntry[];
  weeklyMoodCounts: Record<string, number>;
  moodDistribution: Record<string, number>;
  weeklySummary: WeeklySummary;
  moodTrend: number;
}

export function useInsightsData() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Load mood entries from localStorage
    const fetchMoodData = () => {
      setIsLoading(true);
      
      try {
        const storageKey = `mindscape_moods_${user.id}`;
        const storedMoods = localStorage.getItem(storageKey);
        let moodEntries: MoodEntry[] = [];
        
        if (storedMoods) {
          moodEntries = JSON.parse(storedMoods);
          
          // Make sure dates are Date objects
          moodEntries = moodEntries.map(entry => ({
            ...entry,
            date: new Date(entry.date)
          }));
        }
        
        // Get moods from the last 14 days
        const today = new Date();
        const twoWeeksAgo = subDays(today, 14);
        const recentMoods = moodEntries
          .filter(entry => new Date(entry.date) >= twoWeeksAgo)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Calculate mood distribution
        const moodDistribution: Record<string, number> = {};
        moodEntries.forEach(entry => {
          moodDistribution[entry.value] = (moodDistribution[entry.value] || 0) + 1;
        });
        
        // Calculate this week's mood counts by day
        const currentWeekStart = startOfWeek(today);
        const currentWeekEnd = endOfWeek(today);
        const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });
        
        const weeklyMoodCounts: Record<string, number> = {};
        daysInWeek.forEach(day => {
          const dayName = format(day, 'EEE');
          weeklyMoodCounts[dayName] = 0;
        });
        
        moodEntries.forEach(entry => {
          const entryDate = new Date(entry.date);
          if (entryDate >= currentWeekStart && entryDate <= currentWeekEnd) {
            const dayName = format(entryDate, 'EEE');
            weeklyMoodCounts[dayName] = (weeklyMoodCounts[dayName] || 0) + 1;
          }
        });
        
        // Calculate mood trend (positive or negative)
        const lastWeekMoods = moodEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= subDays(currentWeekStart, 7) && entryDate < currentWeekStart;
        });
        
        const thisWeekMoods = moodEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= currentWeekStart && entryDate <= currentWeekEnd;
        });
        
        // Map mood values to numeric scores for trend calculation
        const moodScores: Record<string, number> = {
          "amazing": 5,
          "good": 4,
          "okay": 3,
          "sad": 2,
          "awful": 1
        };
        
        const lastWeekAvg = lastWeekMoods.length > 0 
          ? lastWeekMoods.reduce((sum, entry) => sum + moodScores[entry.value], 0) / lastWeekMoods.length 
          : 0;
          
        const thisWeekAvg = thisWeekMoods.length > 0 
          ? thisWeekMoods.reduce((sum, entry) => sum + moodScores[entry.value], 0) / thisWeekMoods.length 
          : 0;
        
        const moodTrend = lastWeekAvg > 0 
          ? Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100) 
          : 0;
        
        // Mock weekly summary data that would normally come from multiple sources
        // In a real app, this would be fetched from journal entries, habits, etc.
        const getMoodAverageLabel = (moods: MoodEntry[]): string => {
          if (!moods.length) return "No Data";
          
          const avgScore = moods.reduce((sum, entry) => sum + moodScores[entry.value], 0) / moods.length;
          
          if (avgScore >= 4.5) return "Amazing";
          if (avgScore >= 3.5) return "Good";
          if (avgScore >= 2.5) return "Okay";
          if (avgScore >= 1.5) return "Sad";
          return "Awful";
        };
        
        // Construct weekly summary
        const weeklySummary: WeeklySummary = {
          moodAverage: getMoodAverageLabel(thisWeekMoods),
          journalEntries: Math.floor(Math.random() * 7) + 1, // Mock data, would come from journal
          completedHabits: `${Math.floor(Math.random() * 15) + 5}/${Math.floor(Math.random() * 10) + 15}`, // Mock data
          mindfulnessMinutes: Math.floor(Math.random() * 60) + 15 // Mock data
        };
        
        // Set insights data
        setData({
          recentMoods,
          weeklyMoodCounts,
          moodDistribution,
          weeklySummary,
          moodTrend
        });
        
      } catch (error) {
        console.error("Failed to load insights data:", error);
        // Set default data in case of error
        setData({
          recentMoods: [],
          weeklyMoodCounts: {},
          moodDistribution: {},
          weeklySummary: {
            moodAverage: "No Data",
            journalEntries: 0,
            completedHabits: "0/0",
            mindfulnessMinutes: 0
          },
          moodTrend: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMoodData();
    
  }, [user]);
  
  return { data, isLoading };
}
