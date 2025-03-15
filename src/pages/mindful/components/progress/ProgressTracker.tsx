
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, Trophy, Target, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ProgressLogItem, MindfulStat } from "../../types";
import { mindfulSummaryStats } from "../../data/summaryData";

export default function ProgressTracker() {
  const [progressLog] = useLocalStorage<ProgressLogItem[]>("mindful-progress-log", []);
  const [weeklyGoal] = useLocalStorage<number>("mindful-weekly-goal", 3);
  const [currentStreak] = useLocalStorage<number>("mindful-current-streak", 0);
  const [bestStreak] = useLocalStorage<number>("mindful-best-streak", 0);
  const [totalSessions] = useLocalStorage<number>("mindful-total-sessions", 0);
  const [totalMinutes] = useLocalStorage<number>("mindful-total-minutes", 0);
  
  const calculateWeeklyProgress = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const sessionsThisWeek = progressLog.filter(log => 
      new Date(log.date) >= startOfWeek
    ).length;
    
    return Math.min((sessionsThisWeek / weeklyGoal) * 100, 100);
  };
  
  const weeklyProgress = calculateWeeklyProgress();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-mindscape-primary" />
          Your Progress
        </h2>
        <span className="text-sm text-muted-foreground">{format(new Date(), "MMMM yyyy")}</span>
      </div>
      
      <Card className="bg-gradient-to-br from-mindscape-light/30 to-transparent border-mindscape-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Goal</CardTitle>
          <CardDescription>
            {weeklyProgress >= 100 
              ? "Congratulations! You've met your weekly goal."
              : `${weeklyGoal - Math.floor(weeklyGoal * (weeklyProgress / 100))} more sessions to reach your goal`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress 
            value={weeklyProgress} 
            className="h-3"
            indicatorClassName="bg-mindscape-primary"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>0/{weeklyGoal}</span>
            <span>{Math.floor(weeklyGoal/2)}/{weeklyGoal}</span>
            <span>{weeklyGoal}/{weeklyGoal}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-mindscape-tertiary">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-mindscape-primary" />
              Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-mindscape-tertiary">{bestStreak}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-mindscape-tertiary">{totalSessions}</span>
              <span className="text-sm text-muted-foreground">completed</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Total Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-mindscape-tertiary">{totalMinutes}</span>
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mt-6">Mindfulness Benefits</h3>
      <div className="grid grid-cols-1 gap-4">
        {mindfulSummaryStats.map((stat: MindfulStat) => (
          <Card 
            key={stat.id}
            className={cn(
              "border border-border/50 overflow-hidden hover:shadow-sm transition-shadow",
              stat.color === "blue" && "bg-gradient-to-r from-blue-50/50 to-transparent",
              stat.color === "purple" && "bg-gradient-to-r from-purple-50/50 to-transparent",
              stat.color === "green" && "bg-gradient-to-r from-green-50/50 to-transparent",
              stat.color === "orange" && "bg-gradient-to-r from-orange-50/50 to-transparent"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{stat.title}</CardTitle>
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    stat.color === "blue" && "bg-blue-100/50 text-blue-500",
                    stat.color === "purple" && "bg-purple-100/50 text-purple-500",
                    stat.color === "green" && "bg-green-100/50 text-green-500",
                    stat.color === "orange" && "bg-orange-100/50 text-orange-500"
                  )}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
