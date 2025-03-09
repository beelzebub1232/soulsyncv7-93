
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";

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
            const completedThisWeek = habitEntries.filter((entry: any) => 
              new Date(entry.date) >= oneWeekAgo && entry.completed
            ).length;
            
            // Calculate total possible habits this week
            const totalHabitsThisWeek = habitEntries.filter((entry: any) => 
              new Date(entry.date) >= oneWeekAgo
            ).length;
            
            habitStreaks = totalHabitsThisWeek > 0 
              ? Math.min(100, Math.round((completedThisWeek / totalHabitsThisWeek) * 100))
              : Math.min(100, recentMoods.length * 15); // Fallback based on mood entries
            
            // Activity level is average of mood trend, journal consistency and habit streaks
            activityLevel = Math.round((Math.abs(moodTrend) + journalConsistency + habitStreaks) / 3);
          } else {
            // Fallback to mood-based estimates if no habit data
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
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${insights.moodTrend >= 0 
                ? 'bg-gradient-to-r from-green-300 to-green-500' 
                : 'bg-gradient-to-r from-orange-300 to-red-400'} 
                rounded-full`}
              style={{ width: `${Math.min(100, Math.max(30, Math.abs(insights.moodTrend) + 50))}%` }}
            ></div>
          </div>
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
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${insights.journalConsistency >= 50 
                ? 'bg-gradient-to-r from-blue-300 to-blue-500' 
                : 'bg-gradient-to-r from-orange-300 to-red-400'} 
                rounded-full`}
              style={{ width: `${insights.journalConsistency}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Habit Streaks</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-end gap-1 mt-2">
            {Array.from({ length: 7 }).map((_, i) => {
              // Create a dynamic bar chart visualization
              const percentage = Math.min(100, (insights.habitStreaks / 100) * (i + 1) * 14);
              const height = Math.max(4, percentage / 8); // 4-12px height range
              const color = 100 + (i * 70); // 100-500 blue color range
              
              return (
                <div 
                  key={i} 
                  className={`bg-blue-${color} h-${Math.round(height)} w-2 rounded-t`}
                  style={{ height: `${height}px` }}
                ></div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Activity Level</h3>
            <Activity className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground mb-1">Weekly progress</p>
          <div className="flex items-center gap-1 text-lg font-medium">
            <span className="text-purple-600">{insights.activityLevel}%</span>
            <span className="text-xs text-muted-foreground">of your goal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
