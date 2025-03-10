
import { useState, useEffect } from "react";
import { InsightData } from "./types";
import { calculateMoodTrend, getMoodScores } from "./utils";

export function useInsights(userId?: string) {
  const [insights, setInsights] = useState<InsightData>({
    moodTrend: 0,
    journalConsistency: 0,
    habitStreaks: 0,
    activityLevel: 0
  });
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchData = () => {
      const moodStorageKey = `soulsync_moods`;
      const storedMoods = localStorage.getItem(moodStorageKey);
      
      const journalStorageKey = `soulsync_journal_${userId}`;
      const storedJournals = localStorage.getItem(journalStorageKey);
      
      const habitsStorageKey = `soulsync_habits_${userId}`;
      const storedHabits = localStorage.getItem(habitsStorageKey);
      
      try {
        // Process mood data for trend
        let moodTrend = 0;
        
        if (storedMoods) {
          const moodEntries = JSON.parse(storedMoods);
          
          // Map mood values to numeric scores
          const moodScores = getMoodScores();
          
          // Get today and one week ago
          const today = new Date();
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(today.getDate() - 7);
          
          // Calculate current week vs previous week mood score
          const recentMoods = moodEntries.filter((entry: any) => 
            new Date(entry.date) >= oneWeekAgo
          );
          
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(today.getDate() - 14);
          
          const previousWeekMoods = moodEntries.filter((entry: any) => 
            new Date(entry.date) >= twoWeeksAgo && new Date(entry.date) < oneWeekAgo
          );
          
          const recentAvg = recentMoods.length > 0 
            ? recentMoods.reduce((sum: number, entry: any) => sum + (moodScores[entry.value] || 3), 0) / recentMoods.length 
            : 0;
            
          const prevAvg = previousWeekMoods.length > 0 
            ? previousWeekMoods.reduce((sum: number, entry: any) => sum + (moodScores[entry.value] || 3), 0) / previousWeekMoods.length 
            : 0;
          
          // Calculate trend percent change (capped at ±50%)
          moodTrend = calculateMoodTrend(recentAvg, prevAvg);
          moodTrend = Math.max(-50, Math.min(50, moodTrend));
        }
            
        // Process journal data
        let journalConsistency = 0;
        if (storedJournals) {
          const journalEntries = JSON.parse(storedJournals);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          const thisWeekJournals = journalEntries.filter((entry: any) => 
            new Date(entry.date) >= oneWeekAgo
          );
          
          const daysWithJournals = new Set(
            thisWeekJournals.map((entry: any) => new Date(entry.date).toDateString())
          ).size;
          
          // Journal consistency percentage (out of 7 days)
          journalConsistency = Math.round((daysWithJournals / 7) * 100);
        }
        
        // Process habit data
        let habitStreaks = 0;
        let activityLevel = 0;
        
        if (storedHabits) {
          const habitEntries = JSON.parse(storedHabits);
          
          // Calculate habit streaks
          if (habitEntries.length > 0) {
            // Group habits by name
            const habitGroups: Record<string, any[]> = {};
            habitEntries.forEach((entry: any) => {
              if (!habitGroups[entry.name]) {
                habitGroups[entry.name] = [];
              }
              habitGroups[entry.name].push(entry);
            });
            
            // Calculate streaks for each habit
            const habitStreakValues: number[] = [];
            
            Object.values(habitGroups).forEach((entries: any[]) => {
              // Sort entries by date
              const sortedEntries = [...entries].sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              
              // Find the longest streak of completed habits
              let currentStreak = 0;
              let maxStreak = 0;
              
              sortedEntries.forEach((entry) => {
                if (entry.completed) {
                  currentStreak++;
                  maxStreak = Math.max(maxStreak, currentStreak);
                } else {
                  currentStreak = 0;
                }
              });
              
              // Calculate streak percentage (max 100%)
              const streakPercentage = Math.min(100, Math.round((maxStreak / 7) * 100));
              habitStreakValues.push(streakPercentage);
            });
            
            // Average of all habit streaks
            habitStreaks = habitStreakValues.length > 0
              ? Math.round(habitStreakValues.reduce((sum, val) => sum + val, 0) / habitStreakValues.length)
              : 0;
              
            // Calculate actual activity level from habit completions this week
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            
            const thisWeekHabits = habitEntries.filter((entry: any) => 
              new Date(entry.date) >= oneWeekAgo
            );
            
            const completedThisWeek = thisWeekHabits.filter((entry: any) => entry.completed).length;
            const totalHabitsThisWeek = thisWeekHabits.length;
            
            const habitCompletionRate = totalHabitsThisWeek > 0 
              ? Math.round((completedThisWeek / totalHabitsThisWeek) * 100)
              : 0;
            
            // Journal activity
            const journalActivityRate = journalConsistency;
            
            // Mood engagement (percentage of days with mood entries)
            const recentMoods = storedMoods 
              ? JSON.parse(storedMoods).filter((entry: any) => new Date(entry.date) >= oneWeekAgo)
              : [];
            
            const daysWithMoods = new Set(
              recentMoods.map((entry: any) => new Date(entry.date).toDateString())
            ).size;
            const moodEngagementRate = Math.round((daysWithMoods / 7) * 100);
            
            // Calculate overall activity level as weighted average
            activityLevel = Math.round(
              (habitCompletionRate * 0.5) + (journalActivityRate * 0.3) + (moodEngagementRate * 0.2)
            );
          }
        }
        
        // If no data exists, fallback to defaults
        if ((!storedHabits || JSON.parse(storedHabits).length === 0) && storedMoods) {
          const moodEntries = JSON.parse(storedMoods);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          const recentMoods = moodEntries.filter((entry: any) => 
            new Date(entry.date) >= oneWeekAgo
          );
          
          habitStreaks = Math.min(100, recentMoods.length * 15);
          activityLevel = Math.min(100, Math.max(30, recentMoods.length * 10));
        }
        
        setInsights({
          moodTrend,
          journalConsistency,
          habitStreaks,
          activityLevel
        });
      } catch (err) {
        console.error("Failed to load insights data", err);
      }
    };
    
    fetchData();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (e.key.startsWith('soulsync_') || e.key === 'soulsync_moods')) {
        fetchData();
      }
    };
    
    // Also run a periodic refresh to catch changes
    const intervalId = setInterval(fetchData, 5000);
    
    // Use custom event for immediate updates
    const handleCustomStorageChange = () => {
      fetchData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('soulsync_data_updated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soulsync_data_updated', handleCustomStorageChange);
      clearInterval(intervalId);
    };
    
  }, [userId]);

  return insights;
}
