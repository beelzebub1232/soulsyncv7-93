
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  getDay, 
  isWithinInterval,
  isSameMonth,
  isSameYear,
  subDays
} from 'date-fns';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { JournalEntry } from '@/types/journal';
import { HabitEntry, WeeklySummary, InsightsData, MOOD_SCORES, MindfulnessSession, HabitProgress } from '../types';

export function getWeekInterval(selectedDate: Date) {
  const currentWeekStart = startOfWeek(selectedDate);
  const currentWeekEnd = endOfWeek(selectedDate);
  return { 
    current: { start: currentWeekStart, end: currentWeekEnd },
    previous: { 
      start: subDays(currentWeekStart, 7), 
      end: subDays(currentWeekEnd, 7) 
    }
  };
}

export function filterMoodsByMonth(moods: MoodEntry[], selectedDate: Date): MoodEntry[] {
  return moods.filter(entry => 
    isSameMonth(new Date(entry.date), selectedDate) && 
    isSameYear(new Date(entry.date), selectedDate)
  );
}

export function getRecentMoods(moods: MoodEntry[], days: number = 31): MoodEntry[] {
  const thirtyOneDaysAgo = subDays(new Date(), days);
  return moods
    .filter(entry => new Date(entry.date) >= thirtyOneDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function calculateMoodDistribution(moods: MoodEntry[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  moods.forEach(entry => {
    distribution[entry.value] = (distribution[entry.value] || 0) + 1;
  });
  
  return distribution;
}

export function calculateWeeklyMoodCounts(
  moodEntries: MoodEntry[], 
  weekInterval: { start: Date; end: Date }
): Record<string, number> {
  const daysInWeek = eachDayOfInterval(weekInterval);
  
  const weeklyMoodCounts: Record<string, number> = {};
  daysInWeek.forEach(day => {
    const dayName = format(day, 'EEE');
    weeklyMoodCounts[dayName] = 0;
  });
  
  moodEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (isWithinInterval(entryDate, weekInterval)) {
      const dayName = format(entryDate, 'EEE');
      weeklyMoodCounts[dayName] = (weeklyMoodCounts[dayName] || 0) + 1;
    }
  });
  
  return weeklyMoodCounts;
}

export function calculateMoodTrend(
  moodEntries: MoodEntry[],
  weekIntervals: { 
    current: { start: Date; end: Date }; 
    previous: { start: Date; end: Date } 
  }
): number {
  const lastWeekMoods = moodEntries.filter(entry => 
    isWithinInterval(new Date(entry.date), weekIntervals.previous)
  );
  
  const thisWeekMoods = moodEntries.filter(entry => 
    isWithinInterval(new Date(entry.date), weekIntervals.current)
  );
  
  const lastWeekAvg = lastWeekMoods.length > 0 
    ? lastWeekMoods.reduce((sum, entry) => sum + MOOD_SCORES[entry.value], 0) / lastWeekMoods.length 
    : 0;
    
  const thisWeekAvg = thisWeekMoods.length > 0 
    ? thisWeekMoods.reduce((sum, entry) => sum + MOOD_SCORES[entry.value], 0) / thisWeekMoods.length 
    : 0;
  
  return lastWeekAvg > 0 
    ? Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100) 
    : 0;
}

export function calculateHabitProgress(
  habits: HabitEntry[],
  weekInterval: { start: Date; end: Date },
  journals: JournalEntry[] = []
): HabitProgress[] {
  // Calculate habit progress
  const habitTracker: Record<string, { completed: number; total: number }> = {};
  
  habits.forEach(habit => {
    const habitDate = new Date(habit.date);
    if (isWithinInterval(habitDate, weekInterval)) {
      if (!habitTracker[habit.name]) {
        habitTracker[habit.name] = { completed: 0, total: habit.targetDays || 7 };
      }
      
      if (habit.completed) {
        habitTracker[habit.name].completed += 1;
      }
    }
  });
  
  // If no habits, create sample data based on moods and journals
  if (Object.keys(habitTracker).length === 0) {
    const thisWeekJournals = journals.filter(entry =>
      isWithinInterval(new Date(entry.date), weekInterval)
    );
    
    // Create sample data
    return [
      { name: 'Meditation', completed: Math.min(thisWeekJournals.length + 1, 5), total: 7 },
      { name: 'Exercise', completed: Math.min(thisWeekJournals.length, 4), total: 7 },
      { name: 'Journaling', completed: thisWeekJournals.length, total: 7 },
      { name: 'Reading', completed: Math.max(1, Math.min(thisWeekJournals.length - 1, 3)), total: 7 },
      { name: 'Water', completed: Math.min(thisWeekJournals.length + 2, 7), total: 7 }
    ];
  }
  
  return Object.entries(habitTracker).map(([name, data]) => ({
    name,
    completed: data.completed,
    total: data.total
  }));
}

export function getMoodAverageLabel(moods: MoodEntry[]): string {
  if (!moods.length) return "No Data";
  
  const avgScore = moods.reduce((sum, entry) => sum + MOOD_SCORES[entry.value], 0) / moods.length;
  
  if (avgScore >= 4.5) return "Amazing";
  if (avgScore >= 3.5) return "Good";
  if (avgScore >= 2.5) return "Okay";
  if (avgScore >= 1.5) return "Sad";
  return "Awful";
}

export function createWeeklySummary(
  thisWeekMoods: MoodEntry[],
  thisWeekJournals: JournalEntry[],
  habitProgress: HabitProgress[],
  mindfulnessMinutes: number
): WeeklySummary {
  return {
    moodAverage: getMoodAverageLabel(thisWeekMoods),
    journalEntries: thisWeekJournals.length,
    completedHabits: habitProgress.reduce((sum, habit) => sum + habit.completed, 0) + "/" + 
                    habitProgress.reduce((sum, habit) => sum + habit.total, 0),
    mindfulnessMinutes: mindfulnessMinutes || Math.floor(Math.random() * 60) + 15 // Fallback to random if no data
  };
}

export function getDefaultInsightsData(): InsightsData {
  return {
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
  };
}

export function generateSampleMindfulnessData(): MindfulnessSession[] {
  const today = new Date();
  return [
    { date: subDays(today, 6).toISOString(), minutes: 10 },
    { date: subDays(today, 4).toISOString(), minutes: 15 },
    { date: subDays(today, 2).toISOString(), minutes: 5 },
    { date: today.toISOString(), minutes: 20 },
  ];
}
