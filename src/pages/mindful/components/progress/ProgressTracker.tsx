
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, Trophy, Target, Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { format, isToday, startOfWeek, endOfWeek, differenceInDays, isSameDay, isWithinInterval } from "date-fns";
import { ProgressLogItem, MindfulStat } from "../../types";
import { mindfulSummaryStats } from "../../data/summaryData";
import * as mindfulStorage from "../../services/mindfulStorage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProgressTracker() {
  const [progressLog, setProgressLog] = useState<ProgressLogItem[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(3);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Load data from localStorage
    setProgressLog(mindfulStorage.getProgressLog());
    setWeeklyGoal(mindfulStorage.getWeeklyGoal());
    setCurrentStreak(mindfulStorage.getCurrentStreak());
    setBestStreak(mindfulStorage.getBestStreak());
    setTotalSessions(mindfulStorage.getTotalSessions());
    setTotalMinutes(mindfulStorage.getTotalMinutes());
    
    // Listen for storage changes
    const handleStorageChange = () => {
      setProgressLog(mindfulStorage.getProgressLog());
      setWeeklyGoal(mindfulStorage.getWeeklyGoal());
      setCurrentStreak(mindfulStorage.getCurrentStreak());
      setBestStreak(mindfulStorage.getBestStreak());
      setTotalSessions(mindfulStorage.getTotalSessions());
      setTotalMinutes(mindfulStorage.getTotalMinutes());
    };
    
    // Listen for custom event from mindful exercises
    window.addEventListener('mindful_exercise_completed', handleStorageChange);
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('mindful-')) {
        handleStorageChange();
      }
    });
    
    return () => {
      window.removeEventListener('mindful_exercise_completed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const calculateWeeklyProgress = () => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const sessionsThisWeek = progressLog.filter(log => {
      const logDate = new Date(log.date);
      return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
    }).length;
    
    return Math.min((sessionsThisWeek / weeklyGoal) * 100, 100);
  };
  
  const weeklyProgress = calculateWeeklyProgress();
  
  const getWeeklySessionCount = () => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    return progressLog.filter(log => {
      const logDate = new Date(log.date);
      return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
    }).length;
  };
  
  const getWeeklyMinutes = () => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    return progressLog
      .filter(log => {
        const logDate = new Date(log.date);
        return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
      })
      .reduce((total, log) => total + log.duration, 0);
  };
  
  const weeklySessionCount = getWeeklySessionCount();
  const weeklyMinutes = getWeeklyMinutes();
  
  const getExerciseTypeCounts = () => {
    const breathingCount = progressLog.filter(log => log.exerciseType === "breathing").length;
    const mindfulnessCount = progressLog.filter(log => log.exerciseType === "mindfulness").length;
    return { breathingCount, mindfulnessCount };
  };
  
  const { breathingCount, mindfulnessCount } = getExerciseTypeCounts();
  
  const ActivityCalendar = () => {
    const now = new Date();
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - now.getDay() + i);
      return d;
    });
    
    return (
      <div className="grid grid-cols-7 gap-1 mt-4">
        {weekDays.map((day, i) => {
          const dayActivities = progressLog.filter(log => {
            const logDate = new Date(log.date);
            return isSameDay(logDate, day);
          });
          
          return (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">{format(day, 'EEE')}</span>
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs",
                  isToday(day) && "ring-2 ring-mindscape-primary/50",
                  dayActivities.length === 0 && "bg-muted",
                  dayActivities.length === 1 && "bg-mindscape-light/50 text-mindscape-tertiary",
                  dayActivities.length >= 2 && "bg-mindscape-primary text-white"
                )}
              >
                {format(day, 'd')}
              </div>
              {dayActivities.length > 0 && (
                <span className="text-xs mt-1">{dayActivities.length}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  const SessionHistoryItem = ({ item }: { item: ProgressLogItem }) => {
    const date = new Date(item.date);
    
    return (
      <div className="flex items-center justify-between p-3 border-b border-border/50 last:border-b-0">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            item.exerciseType === "breathing" ? "bg-blue-100" : "bg-purple-100"
          )}>
            {item.exerciseType === "breathing" ? (
              <Calendar className="h-4 w-4 text-blue-600" />
            ) : (
              <CalendarIcon className="h-4 w-4 text-purple-600" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{item.exerciseType === "breathing" ? "Breathing" : "Mindfulness"} Session</p>
            <p className="text-xs text-muted-foreground">{format(date, 'PPp')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{item.duration} min</p>
        </div>
      </div>
    );
  };
  
  const DetailedHistory = () => {
    const sortedLog = [...progressLog].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return (
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-mindscape-primary" />
            Exercise History
          </CardTitle>
          <CardDescription>Your mindfulness practice over time</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {sortedLog.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No activities recorded yet. Start your mindfulness journey by completing an exercise.
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border/50">
                {sortedLog.map((item) => (
                  <SessionHistoryItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-mindscape-primary" />
          Your Progress
        </h2>
        <span className="text-sm text-muted-foreground">{format(new Date(), "MMMM yyyy")}</span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-gradient-to-br from-mindscape-light/30 to-transparent border-mindscape-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weekly Goal</CardTitle>
              <CardDescription>
                {weeklyProgress >= 100 
                  ? "Congratulations! You've met your weekly goal."
                  : `${weeklyGoal - weeklySessionCount} more sessions to reach your goal`
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
                <span>{weeklySessionCount}/{weeklyGoal}</span>
                <span>{Math.floor(weeklyGoal/2)}/{weeklyGoal}</span>
                <span>{weeklyGoal}/{weeklyGoal}</span>
              </div>
              
              <ActivityCalendar />
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
          
          <Card className="border border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sessions by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Breathing</span>
                    </div>
                    <span className="text-sm font-medium">{breathingCount}</span>
                  </div>
                  <Progress value={(breathingCount / (breathingCount + mindfulnessCount || 1)) * 100} className="h-2" indicatorClassName="bg-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm">Mindfulness</span>
                    </div>
                    <span className="text-sm font-medium">{mindfulnessCount}</span>
                  </div>
                  <Progress value={(mindfulnessCount / (breathingCount + mindfulnessCount || 1)) * 100} className="h-2" indicatorClassName="bg-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
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
        </TabsContent>
        
        <TabsContent value="history">
          <DetailedHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
