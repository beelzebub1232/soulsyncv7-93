
import { ProgressLogItem } from "../types";

// Storage keys
const BREATHING_COMPLETED_KEY = "mindful-breathing-completed";
const MINDFULNESS_COMPLETED_KEY = "mindful-mindfulness-completed";
const BREATHING_FAVORITES_KEY = "breathing-favorites";
const MINDFULNESS_FAVORITES_KEY = "mindfulness-favorites";
const CURRENT_STREAK_KEY = "mindful-current-streak";
const BEST_STREAK_KEY = "mindful-best-streak";
const TOTAL_SESSIONS_KEY = "mindful-total-sessions";
const TOTAL_MINUTES_KEY = "mindful-total-minutes";
const PROGRESS_LOG_KEY = "mindful-progress-log";
const WEEKLY_GOAL_KEY = "mindful-weekly-goal";
const QUIZ_RESULTS_KEY = "mindful-quiz-results";

// Get functions
export function getBreathingCompleted(): string[] {
  return getItem(BREATHING_COMPLETED_KEY, []);
}

export function getMindfulnessCompleted(): string[] {
  return getItem(MINDFULNESS_COMPLETED_KEY, []);
}

export function getBreathingFavorites(): string[] {
  return getItem(BREATHING_FAVORITES_KEY, []);
}

export function getMindfulnessFavorites(): string[] {
  return getItem(MINDFULNESS_FAVORITES_KEY, []);
}

export function getCurrentStreak(): number {
  return getItem(CURRENT_STREAK_KEY, 0);
}

export function getBestStreak(): number {
  return getItem(BEST_STREAK_KEY, 0);
}

export function getTotalSessions(): number {
  return getItem(TOTAL_SESSIONS_KEY, 0);
}

export function getTotalMinutes(): number {
  return getItem(TOTAL_MINUTES_KEY, 0);
}

export function getProgressLog(): ProgressLogItem[] {
  return getItem(PROGRESS_LOG_KEY, []);
}

export function getWeeklyGoal(): number {
  return getItem(WEEKLY_GOAL_KEY, 3);
}

export function getQuizResults(): any[] {
  return getItem(QUIZ_RESULTS_KEY, []);
}

// Save functions
export function saveBreathingCompleted(completed: string[]): void {
  saveItem(BREATHING_COMPLETED_KEY, completed);
}

export function saveMindfulnessCompleted(completed: string[]): void {
  saveItem(MINDFULNESS_COMPLETED_KEY, completed);
}

export function saveBreathingFavorites(favorites: string[]): void {
  saveItem(BREATHING_FAVORITES_KEY, favorites);
}

export function saveMindfulnessFavorites(favorites: string[]): void {
  saveItem(MINDFULNESS_FAVORITES_KEY, favorites);
}

export function saveCurrentStreak(streak: number): void {
  saveItem(CURRENT_STREAK_KEY, streak);
}

export function saveBestStreak(streak: number): void {
  saveItem(BEST_STREAK_KEY, streak);
}

export function saveTotalSessions(sessions: number): void {
  saveItem(TOTAL_SESSIONS_KEY, sessions);
}

export function saveTotalMinutes(minutes: number): void {
  saveItem(TOTAL_MINUTES_KEY, minutes);
}

export function saveProgressLog(log: ProgressLogItem[]): void {
  saveItem(PROGRESS_LOG_KEY, log);
}

export function saveWeeklyGoal(goal: number): void {
  saveItem(WEEKLY_GOAL_KEY, goal);
}

export function saveQuizResults(results: any[]): void {
  saveItem(QUIZ_RESULTS_KEY, results);
}

// Log a completed exercise
export function logExerciseCompletion(
  exerciseId: string, 
  exerciseType: "breathing" | "mindfulness", 
  durationMinutes: number
): void {
  // Update total sessions
  const totalSessions = getTotalSessions();
  saveTotalSessions(totalSessions + 1);
  
  // Update total minutes
  const totalMinutes = getTotalMinutes();
  saveTotalMinutes(totalMinutes + durationMinutes);
  
  // Update streak
  updateStreak();
  
  // Add to progress log
  const progressLog = getProgressLog();
  const newLogItem: ProgressLogItem = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    exerciseId,
    exerciseType,
    duration: durationMinutes
  };
  
  progressLog.push(newLogItem);
  saveProgressLog(progressLog);
  
  // Update completed exercises list
  if (exerciseType === "breathing") {
    const completed = getBreathingCompleted();
    if (!completed.includes(exerciseId)) {
      completed.push(exerciseId);
      saveBreathingCompleted(completed);
    }
  } else {
    const completed = getMindfulnessCompleted();
    if (!completed.includes(exerciseId)) {
      completed.push(exerciseId);
      saveMindfulnessCompleted(completed);
    }
  }
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('mindful_exercise_completed'));
}

// Helper function to update streak
function updateStreak(): void {
  const currentStreak = getCurrentStreak();
  const bestStreak = getBestStreak();
  
  // For simplicity, we're just incrementing the streak
  // A more robust implementation would check the date of the last exercise
  const newStreak = currentStreak + 1;
  saveCurrentStreak(newStreak);
  
  if (newStreak > bestStreak) {
    saveBestStreak(newStreak);
  }
}

// Helper functions for localStorage
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to localStorage:`, error);
  }
}
