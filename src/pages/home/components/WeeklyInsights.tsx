
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Progress } from "@/components/ui/progress";

export function WeeklyInsights() {
  const { user } = useUser();
  const [insights, setInsights] = useState({
    moodTrend: 0,
    journalConsistency: 0,
    habitStreaks: 0,
    activityLevel: 0
  });
  
  useEffect(() => {
    if (!user) return;
    
    // Load mood data
    const fetchData = () => {
      const moodStorageKey = `soulsync_moods`;
      const storedMoods = localStorage.getItem(moodStorageKey);
      
      const journalStorageKey = `soulsync_journal_${user.id}`;
      const storedJournals = localStorage.getItem(journalStorageKey);
      
      const habitsStorageKey = `soulsync_habits_${user.id}`;
      const storedHabits = localStorage.getItem(habitsStorageKey);
      
      // Process mood data for trend
      if (storedMoods) {
        try {
          const moodEntries = JSON.parse(storedMoods);
          
          // Map mood values to numeric scores
          const moodScores: Record<string, number> = {
            "amazing": 5, "good": 4, "okay": 3, "sad": 2, "awful": 1
          };
          
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
          
          // Calculate trend percent change
          const moodTrend = prevAvg > 0 
            ? Math.round(((recentAvg - prevAvg) / prevAvg) * 100) 
            : (recentAvg > 0 ? 100 : 0);
            
          // Process journal data
          let journalConsistency = 0;
          if (storedJournals) {
            const journalEntries = JSON.parse(storedJournals);
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
          if (!storedHabits || JSON.parse(storedHabits).length === 0) {
            habitStreaks = Math.min(100, recentMoods.length * 15);
            activityLevel = Math.min(100, Math.max(30, recentMoods.length * 20));
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
      }
    };
    
    fetchData();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('soulsync_')) {
        fetchData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
    
  }, [user]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Mood Trend</h3>
            <div className={`flex items-center gap-1 ${insights.moodTrend >= 0 ? 'text-green-500' : 'text-red-500'} text-xs`}>
              {insights.moodTrend >= 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              <span>{Math.abs(insights.moodTrend)}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {insights.moodTrend >= 0 
              ? "Your mood has been improving" 
              : "Your mood has been declining"}
          </p>
          <Progress 
            className="h-2"
            value={Math.min(100, Math.max(30, Math.abs(insights.moodTrend) + 50))}
            indicatorClassName={insights.moodTrend >= 0 
              ? "bg-gradient-to-r from-green-300 to-green-500" 
              : "bg-gradient-to-r from-orange-300 to-red-400"}
          />
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Journal Consistency</h3>
            <div className={`flex items-center gap-1 ${insights.journalConsistency >= 50 ? 'text-green-500' : 'text-red-500'} text-xs`}>
              {insights.journalConsistency >= 50 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              <span>{insights.journalConsistency}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {insights.journalConsistency >= 50 
              ? "Good journaling habits this week" 
              : "Try to journal more regularly"}
          </p>
          <Progress 
            className="h-2"
            value={insights.journalConsistency}
            indicatorClassName={insights.journalConsistency >= 50 
              ? "bg-gradient-to-r from-blue-300 to-blue-500" 
              : "bg-gradient-to-r from-orange-300 to-red-400"}
          />
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Habit Streaks</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {insights.habitStreaks >= 50 
              ? "You're building good habits" 
              : "Keep working on your habits"}
          </p>
          <Progress 
            className="h-2"
            value={insights.habitStreaks}
            indicatorClassName="bg-gradient-to-r from-indigo-300 to-indigo-500"
          />
          <div className="text-xs mt-1 text-right text-muted-foreground">
            {insights.habitStreaks}% consistency
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Activity Level</h3>
            <Activity className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">Weekly progress</p>
          <Progress 
            className="h-2"
            value={insights.activityLevel}
            indicatorClassName="bg-gradient-to-r from-purple-300 to-purple-500"
          />
          <div className="text-xs mt-1 text-right text-muted-foreground">
            {insights.activityLevel}% of your goal
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
