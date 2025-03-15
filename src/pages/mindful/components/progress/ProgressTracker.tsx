
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, Trophy, Target, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { format, subDays, isToday, isYesterday, parseISO } from "date-fns";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ProgressLogItem, MindfulStat } from "../../types";
import { mindfulSummaryStats } from "../../data/summaryData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { breathingExercises } from "../../data/breathingExercises";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProgressTracker() {
  const [progressLog, setProgressLog] = useLocalStorage<ProgressLogItem[]>("mindful-progress-log", []);
  const [weeklyGoal, setWeeklyGoal] = useLocalStorage<number>("mindful-weekly-goal", 3);
  const [currentStreak, setCurrentStreak] = useLocalStorage<number>("mindful-current-streak", 0);
  const [bestStreak, setBestStreak] = useLocalStorage<number>("mindful-best-streak", 0);
  const [totalSessions, setTotalSessions] = useLocalStorage<number>("mindful-total-sessions", 0);
  const [totalMinutes, setTotalMinutes] = useLocalStorage<number>("mindful-total-minutes", 0);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Calculate current streak based on consecutive days with exercises
    const now = new Date();
    const dates = [...new Set(progressLog.map(log => log.date.split('T')[0]))].sort();
    
    if (dates.length === 0) {
      setCurrentStreak(0);
      return;
    }
    
    let streak = 0;
    const today = format(now, 'yyyy-MM-dd');
    
    // Check if there's an exercise today
    const hasExerciseToday = dates.includes(today);
    
    if (!hasExerciseToday) {
      // Check if there's an exercise yesterday
      const yesterday = format(subDays(now, 1), 'yyyy-MM-dd');
      if (!dates.includes(yesterday)) {
        setCurrentStreak(0);
        return;
      }
    }
    
    // Count back from today/yesterday to find the streak
    let checkDate = hasExerciseToday ? now : subDays(now, 1);
    let checking = true;
    
    while (checking) {
      const formattedDate = format(checkDate, 'yyyy-MM-dd');
      if (dates.includes(formattedDate)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        checking = false;
      }
    }
    
    setCurrentStreak(streak);
    
    if (streak > bestStreak) {
      setBestStreak(streak);
    }
    
    // Update total sessions and minutes
    setTotalSessions(progressLog.length);
    const minutes = progressLog.reduce((total, log) => total + log.duration, 0);
    setTotalMinutes(minutes);
    
  }, [progressLog, setBestStreak, setCurrentStreak, setTotalMinutes, setTotalSessions]);
  
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
  
  const getExerciseName = (log: ProgressLogItem) => {
    if (log.exerciseType === "breathing") {
      const exercise = breathingExercises.find(ex => ex.id === log.exerciseId);
      return exercise?.name || "Unknown";
    } else {
      const exercise = mindfulnessExercises.find(ex => ex.id === log.exerciseId);
      return exercise?.name || "Unknown";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-mindscape-primary" />
          Your Progress
        </h2>
        <span className="text-sm text-muted-foreground">{format(new Date(), "MMMM yyyy")}</span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-gradient-to-br from-mindscape-light/30 to-transparent border-mindscape-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Goal</CardTitle>
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
          
          <div className="grid grid-cols-2 gap-3">
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
          
          <div className="grid grid-cols-2 gap-3">
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
          
          <h3 className="text-base font-semibold mt-2">Mindfulness Benefits</h3>
          <Accordion type="single" collapsible className="w-full">
            {mindfulSummaryStats.map((stat: MindfulStat, index) => (
              <AccordionItem key={stat.id} value={`item-${index}`}>
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        stat.color === "blue" && "bg-blue-100/50 text-blue-500",
                        stat.color === "purple" && "bg-purple-100/50 text-purple-500",
                        stat.color === "green" && "bg-green-100/50 text-green-500",
                        stat.color === "orange" && "bg-orange-100/50 text-orange-500"
                      )}
                    >
                      <stat.icon className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-medium">{stat.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground py-2">{stat.description}</p>
                  
                  {stat.benefits && (
                    <div className="mt-2 pl-2 border-l-2 border-mindscape-light">
                      <ul className="space-y-1">
                        {stat.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground">• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-4">
            <Card className="border border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-mindscape-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest mindfulness sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {progressLog.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No activity recorded yet.</p>
                    <p className="text-sm mt-1">Start a session to track your progress!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="space-y-3">
                      {progressLog
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((log, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-border/30 pb-2">
                            <div>
                              <p className="font-medium text-sm">{getExerciseName(log)}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatDate(log.date)}</span>
                                <span>•</span>
                                <span>{log.duration} min</span>
                                <span>•</span>
                                <span className="capitalize">{log.exerciseType}</span>
                              </div>
                            </div>
                            <div 
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                log.exerciseType === "breathing" ? "bg-blue-100/50 text-blue-500" : "bg-purple-100/50 text-purple-500"
                              )}
                            >
                              {log.exerciseType === "breathing" ? (
                                <Activity className="h-4 w-4" />
                              ) : (
                                <Target className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
