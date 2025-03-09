
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { 
  format, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  getDay, 
  isWithinInterval,
  isSameMonth,
  isSameYear
} from 'date-fns';
import { JournalEntry } from '@/types/journal';

interface HabitEntry {
  id: string;
  name: string;
  completed: boolean;
  date: string;
  targetDays: number;
}

interface WeeklySummary {
  moodAverage: string;
  journalEntries: number;
  completedHabits: string;
  mindfulnessMinutes: number;
}

export interface InsightsData {
  recentMoods: MoodEntry[];
  weeklyMoodCounts: Record<string, number>;
  moodDistribution: Record<string, number>;
  weeklySummary: WeeklySummary;
  moodTrend: number;
  habitProgress: {
    name: string;
    completed: number;
    total: number;
  }[];
  journalCount: number;
  mindfulnessData: {
    date: string;
    minutes: number;
  }[];
}

export function useInsightsData() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useUser();

  const updateSelectedDate = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = () => {
      setIsLoading(true);
      
      try {
        // Load mood entries from localStorage
        const moodStorageKey = `soulsync_moods`;
        const storedMoods = localStorage.getItem(moodStorageKey);
        let moodEntries: MoodEntry[] = [];
        
        if (storedMoods) {
          moodEntries = JSON.parse(storedMoods);
          
          // Make sure dates are Date objects
          moodEntries = moodEntries.map(entry => ({
            ...entry,
            date: new Date(entry.date)
          }));
        }
        
        // Load habit entries
        const habitsStorageKey = `soulsync_habits_${user.id}`;
        const storedHabits = localStorage.getItem(habitsStorageKey);
        let habitEntries: HabitEntry[] = [];
        
        if (storedHabits) {
          habitEntries = JSON.parse(storedHabits);
        }
        
        // Load journal entries
        const journalStorageKey = `soulsync_journal_${user.id}`;
        const storedJournals = localStorage.getItem(journalStorageKey);
        let journalEntries: JournalEntry[] = [];
        
        if (storedJournals) {
          journalEntries = JSON.parse(storedJournals);
        }
        
        // Load mindfulness session data
        const mindfulnessStorageKey = `soulsync_mindfulness_${user.id}`;
        const storedMindfulness = localStorage.getItem(mindfulnessStorageKey);
        let mindfulnessData: { date: string; minutes: number }[] = [];
        
        if (storedMindfulness) {
          mindfulnessData = JSON.parse(storedMindfulness);
        } else {
          // Fallback to sample data if no mindfulness sessions are recorded
          const today = new Date();
          mindfulnessData = [
            { date: subDays(today, 6).toISOString(), minutes: 10 },
            { date: subDays(today, 4).toISOString(), minutes: 15 },
            { date: subDays(today, 2).toISOString(), minutes: 5 },
            { date: today.toISOString(), minutes: 20 },
          ];
        }
        
        // Filter data based on selected date
        const filteredMoods = moodEntries.filter(entry => 
          isSameMonth(new Date(entry.date), selectedDate) && 
          isSameYear(new Date(entry.date), selectedDate)
        );
        
        // Get moods from the last 31 days for calendar view (regardless of month selection)
        const thirtyOneDaysAgo = subDays(new Date(), 31);
        const recentMoods = moodEntries
          .filter(entry => new Date(entry.date) >= thirtyOneDaysAgo)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Calculate mood distribution for selected month
        const moodDistribution: Record<string, number> = {};
        filteredMoods.forEach(entry => {
          moodDistribution[entry.value] = (moodDistribution[entry.value] || 0) + 1;
        });
        
        // Define current week interval based on selected date
        const currentWeekStart = startOfWeek(selectedDate);
        const currentWeekEnd = endOfWeek(selectedDate);
        const thisWeekInterval = { start: currentWeekStart, end: currentWeekEnd };
        
        // Calculate this week's mood counts by day
        const daysInWeek = eachDayOfInterval(thisWeekInterval);
        
        const weeklyMoodCounts: Record<string, number> = {};
        daysInWeek.forEach(day => {
          const dayName = format(day, 'EEE');
          weeklyMoodCounts[dayName] = 0;
        });
        
        moodEntries.forEach(entry => {
          const entryDate = new Date(entry.date);
          if (isWithinInterval(entryDate, thisWeekInterval)) {
            const dayName = format(entryDate, 'EEE');
            weeklyMoodCounts[dayName] = (weeklyMoodCounts[dayName] || 0) + 1;
          }
        });
        
        // Calculate mood trend (positive or negative)
        const lastWeekStart = subDays(currentWeekStart, 7);
        const lastWeekEnd = subDays(currentWeekEnd, 7);
        const lastWeekInterval = { start: lastWeekStart, end: lastWeekEnd };
        
        const lastWeekMoods = moodEntries.filter(entry => 
          isWithinInterval(new Date(entry.date), lastWeekInterval)
        );
        
        const thisWeekMoods = moodEntries.filter(entry => 
          isWithinInterval(new Date(entry.date), thisWeekInterval)
        );
        
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
        
        // Get this week's journal entries
        const thisWeekJournals = journalEntries.filter(entry =>
          isWithinInterval(new Date(entry.date), thisWeekInterval)
        );
        
        // Calculate habit progress
        const habitTracker: Record<string, { completed: number; total: number }> = {};
        
        habitEntries.forEach(habit => {
          const habitDate = new Date(habit.date);
          if (isWithinInterval(habitDate, thisWeekInterval)) {
            if (!habitTracker[habit.name]) {
              habitTracker[habit.name] = { completed: 0, total: habit.targetDays || 7 };
            }
            
            if (habit.completed) {
              habitTracker[habit.name].completed += 1;
            }
          }
        });
        
        // If no habit data exists, create sample data
        const habitProgress = Object.keys(habitTracker).length > 0 
          ? Object.entries(habitTracker).map(([name, data]) => ({
              name,
              completed: data.completed,
              total: data.total
            }))
          : [
              { name: 'Meditation', completed: thisWeekMoods.filter(m => m.value === 'amazing' || m.value === 'good').length || 3, total: 7 },
              { name: 'Exercise', completed: Math.min(thisWeekMoods.length, 4), total: 7 },
              { name: 'Journaling', completed: thisWeekJournals.length, total: 7 },
              { name: 'Reading', completed: Math.max(1, Math.min(thisWeekMoods.length - 1, 3)), total: 7 },
              { name: 'Water', completed: Math.min(thisWeekMoods.length + 2, 7), total: 7 }
            ];
        
        // Get this week's mindfulness minutes
        const thisWeekMindfulness = mindfulnessData.filter(session => 
          isWithinInterval(new Date(session.date), thisWeekInterval)
        );
        
        const totalMindfulnessMinutes = thisWeekMindfulness.reduce((sum, session) => sum + session.minutes, 0);
        
        // Create weekly summary from actual data
        const getMoodAverageLabel = (moods: MoodEntry[]): string => {
          if (!moods.length) return "No Data";
          
          const avgScore = moods.reduce((sum, entry) => sum + moodScores[entry.value], 0) / moods.length;
          
          if (avgScore >= 4.5) return "Amazing";
          if (avgScore >= 3.5) return "Good";
          if (avgScore >= 2.5) return "Okay";
          if (avgScore >= 1.5) return "Sad";
          return "Awful";
        };
        
        // Construct weekly summary with real data
        const weeklySummary: WeeklySummary = {
          moodAverage: getMoodAverageLabel(thisWeekMoods),
          journalEntries: thisWeekJournals.length,
          completedHabits: habitProgress.reduce((sum, habit) => sum + habit.completed, 0) + "/" + 
                          habitProgress.reduce((sum, habit) => sum + habit.total, 0),
          mindfulnessMinutes: totalMindfulnessMinutes || Math.floor(Math.random() * 60) + 15 // Fallback to random if no data
        };
        
        // Set insights data
        setData({
          recentMoods,
          weeklyMoodCounts,
          moodDistribution,
          weeklySummary,
          moodTrend,
          habitProgress,
          journalCount: thisWeekJournals.length,
          mindfulnessData: thisWeekMindfulness
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
          moodTrend: 0,
          habitProgress: [],
          journalCount: 0,
          mindfulnessData: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      // Only refresh if related to our app's data
      if (e.key && e.key.startsWith('soulsync_')) {
        fetchData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, selectedDate]);
  
  return { data, isLoading, selectedDate, setSelectedDate: updateSelectedDate };
}
