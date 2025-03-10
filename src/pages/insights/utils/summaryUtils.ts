
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { JournalEntry } from '@/types/journal';
import { HabitProgress, WeeklySummary, InsightsData, MindfulnessSession } from '../types';
import { getMoodAverageLabel } from './moodUtils';

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
  const subDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };
  
  return [
    { date: subDays(today, 6).toISOString(), minutes: 10 },
    { date: subDays(today, 4).toISOString(), minutes: 15 },
    { date: subDays(today, 2).toISOString(), minutes: 5 },
    { date: today.toISOString(), minutes: 20 },
  ];
}
