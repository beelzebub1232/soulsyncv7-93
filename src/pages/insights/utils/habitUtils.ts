
import { HabitEntry, HabitProgress } from '../types';
import { JournalEntry } from '@/types/journal';
import { isWithinInterval } from 'date-fns';

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
