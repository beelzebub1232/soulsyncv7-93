
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, Flame, HeartPulse } from "lucide-react";
import { useInsightsData } from "../hooks/useInsightsData";
import WeeklySummaryDrawer from "./WeeklySummaryDrawer";
import * as mindfulStorage from "@/pages/mindful/services/mindfulStorage";

export function WeeklySummary() {
  const { data, isLoading } = useInsightsData();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Weekly Summary</CardTitle>
          <CardDescription>Loading your wellness data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Get mindfulness sessions from storage
  const mindfulSessions = mindfulStorage.getExerciseCompletions();
  
  // Filter for only this week's sessions
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(now);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const thisWeekSessions = mindfulSessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
  });
  
  // Calculate total mindful minutes this week
  const mindfulMinutes = thisWeekSessions.reduce((total, session) => total + session.duration, 0);
  
  const weeklyData = {
    moodScore: data?.moodScore || 0.6,
    journalCount: data?.journalCount || 0,
    habitCompletionRate: data?.habitCompletionRate || 0.7,
    mindfulMinutes: mindfulMinutes,
    mindfulSessions: thisWeekSessions,
    startDate: startOfWeek,
    endDate: endOfWeek,
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-mindscape-primary" />
          Weekly Summary
        </CardTitle>
        <CardDescription>
          {startOfWeek.toLocaleDateString()} - {endOfWeek.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col items-center justify-center text-center p-3 bg-mindscape-quaternary/10 rounded-md">
            <HeartPulse className="h-6 w-6 mb-1 text-red-500" />
            <span className="text-xs text-muted-foreground">Mood Score</span>
            <span className="text-xl font-bold">{Math.round((data?.moodScore || 0.6) * 100)}%</span>
          </div>
          
          <div className="flex flex-col items-center justify-center text-center p-3 bg-mindscape-quaternary/10 rounded-md">
            <Brain className="h-6 w-6 mb-1 text-purple-500" />
            <span className="text-xs text-muted-foreground">Mindfulness</span>
            <span className="text-xl font-bold">{mindfulMinutes} min</span>
          </div>
          
          <div className="flex flex-col items-center justify-center text-center p-3 bg-mindscape-quaternary/10 rounded-md">
            <Calendar className="h-6 w-6 mb-1 text-blue-500" />
            <span className="text-xs text-muted-foreground">Journal Entries</span>
            <span className="text-xl font-bold">{data?.journalCount || 0}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center text-center p-3 bg-mindscape-quaternary/10 rounded-md">
            <Flame className="h-6 w-6 mb-1 text-orange-500" />
            <span className="text-xs text-muted-foreground">Habit Completion</span>
            <span className="text-xl font-bold">{Math.round((data?.habitCompletionRate || 0.7) * 100)}%</span>
          </div>
        </div>
        
        <WeeklySummaryDrawer weeklyData={weeklyData} />
      </CardContent>
    </Card>
  );
}
