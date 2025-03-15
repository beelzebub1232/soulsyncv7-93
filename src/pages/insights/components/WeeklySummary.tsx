
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, BarChart2, Library, BookOpen, Timer, Brain, Sparkles, Award } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import * as mindfulStorage from '@/pages/mindful/services/mindfulStorage';

interface WeeklySummaryProps {
  moodAverage: string;
  journalEntries: number;
  completedHabits: string;
  mindfulnessMinutes: number;
}

export function WeeklySummary({ 
  moodAverage, 
  journalEntries, 
  completedHabits, 
  mindfulnessMinutes 
}: WeeklySummaryProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Map mood to emoji
  const getMoodEmoji = (mood: string): string => {
    switch(mood.toLowerCase()) {
      case 'amazing': return '😄';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'sad': return '😔';
      case 'awful': return '😞';
      default: return '❓';
    }
  };
  
  // Generate insight based on mood data
  const getInsight = (mood: string): string => {
    if (mood.toLowerCase() === 'no data') {
      return 'Start tracking your mood, habits, and journal entries to get personalized insights.';
    }
    
    switch(mood.toLowerCase()) {
      case 'amazing':
        return 'Your mood has been excellent this week! Keep up with whatever you\'re doing.';
      case 'good':
        return 'Your mood tends to improve on days you complete your morning meditation habit.';
      case 'okay':
        return 'Try increasing your mindfulness minutes to help improve your mood.';
      case 'sad':
        return 'Consider adding more physical activity to your routine to help boost your mood.';
      case 'awful':
        return 'Remember to be kind to yourself during difficult times. Consider reaching out to a friend or professional.';
      default:
        return 'Start tracking your mood regularly to get personalized insights.';
    }
  };
  
  // Generate action recommendations
  const getActionRecommendation = () => {
    if (moodAverage === "No data") {
      return {
        text: "Start tracking your mood",
        action: () => navigate('/home')
      };
    }
    
    if (journalEntries < 3) {
      return {
        text: "Try writing in your journal more often",
        action: () => navigate('/journal')
      };
    }
    
    if (mindfulnessMinutes < 30) {
      return {
        text: "Add more mindfulness sessions to your week",
        action: () => navigate('/mindful')
      };
    }
    
    if (completedHabits !== "No data") {
      const [completed, total] = completedHabits.split('/').map(Number);
      if (completed / total < 0.6) {
        return {
          text: "Focus on completing more of your habits",
          action: () => navigate('/habit-tracker')
        };
      }
    }
    
    return {
      text: "Keep up the good work!",
      action: () => {}
    };
  };
  
  const recommendation = getActionRecommendation();
  const recommendationText = recommendation.text;
  
  // Get mindfulness session data
  const mindfulSessions = mindfulStorage.getProgressLog();
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  
  const currentWeekSessions = mindfulSessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });
  
  // Get breathing vs mindfulness breakdown
  const breathingSessions = currentWeekSessions.filter(session => session.exerciseType === 'breathing');
  const mindfulnessSessions = currentWeekSessions.filter(session => session.exerciseType === 'mindfulness');
  
  // Calculate daily mindfulness averages
  const dailyMinutes = Array(7).fill(0);
  currentWeekSessions.forEach(session => {
    const sessionDate = new Date(session.date);
    const dayIndex = sessionDate.getDay();
    dailyMinutes[dayIndex] += session.duration;
  });
  
  // Weekly stats from mindfulness
  const totalSessions = mindfulStorage.getTotalSessions();
  const bestStreak = mindfulStorage.getBestStreak();
  const currentStreak = mindfulStorage.getCurrentStreak(); 
  
  const DetailedWeeklyReport = () => (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mood">Mood & Habits</TabsTrigger>
          <TabsTrigger value="mindful">Mindfulness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Mood Average</span>
                </div>
                <span className="font-medium flex items-center gap-1">
                  {getMoodEmoji(moodAverage)} {moodAverage}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">Journal Entries</span>
                </div>
                <span className="font-medium">{journalEntries}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Completed Habits</span>
                </div>
                <span className="font-medium">{completedHabits}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Mindfulness Time</span>
                </div>
                <span className="font-medium">{mindfulnessMinutes} mins</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-mindscape-light/20 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-mindscape-primary" />
                Weekly Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{getInsight(moodAverage)}</p>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={recommendation.action}
              >
                {recommendationText}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mood" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {moodAverage === "No data" ? (
                <div className="text-center text-sm text-muted-foreground p-4">
                  No mood data available for this week
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Mood</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{getMoodEmoji(moodAverage)}</span>
                      <span className="text-sm font-medium">{moodAverage}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 pt-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">{day}</span>
                        <div className={cn(
                          "w-8 h-8 rounded-full mt-1 flex items-center justify-center text-xs",
                          i === new Date().getDay() && "ring-2 ring-mindscape-primary",
                        )}></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Habit Completion</CardTitle>
            </CardHeader>
            <CardContent>
              {completedHabits === "No data" ? (
                <div className="text-center text-sm text-muted-foreground p-4">
                  No habit data available for this week
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Progress</span>
                    <span className="text-sm font-medium">{completedHabits}</span>
                  </div>
                  
                  {completedHabits !== "No data" && (
                    <Progress 
                      value={(parseInt(completedHabits.split('/')[0]) / parseInt(completedHabits.split('/')[1])) * 100} 
                      className="h-2"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mindful" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mindfulness Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground">{day.charAt(0)}</span>
                      <div className="w-full h-20 flex items-end justify-center p-1">
                        <div 
                          className={cn(
                            "w-full bg-mindscape-primary/80 rounded-t",
                            dailyMinutes[i] === 0 && "h-1 bg-muted",
                          )}
                          style={{ height: `${Math.min(100, (dailyMinutes[i] / 30) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{dailyMinutes[i]}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Minutes</span>
                    <span className="font-medium">{mindfulnessMinutes}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Session Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Breathing</span>
                    </div>
                    <span className="text-sm font-medium">{breathingSessions.length}</span>
                  </div>
                  <Progress 
                    value={(breathingSessions.length / (currentWeekSessions.length || 1)) * 100} 
                    className="h-2"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm">Mindfulness</span>
                    </div>
                    <span className="text-sm font-medium">{mindfulnessSessions.length}</span>
                  </div>
                  <Progress 
                    value={(mindfulnessSessions.length / (currentWeekSessions.length || 1)) * 100} 
                    className="h-2"
                    indicatorClassName="bg-purple-500"
                  />
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Streak</span>
                    <span className="font-medium">{currentStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Best Streak</span>
                    <span className="font-medium">{bestStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">All-time Sessions</span>
                    <span className="font-medium">{totalSessions}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Choose between dialog (desktop) and drawer (mobile)
  const MobileDrawer = (
    <Drawer>
      <DrawerTrigger asChild>
        <Card className="card-highlight cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mood Average</span>
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getMoodEmoji(moodAverage)}</span>
                  <span className="font-medium">{moodAverage}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Journal Entries</span>
                <span className="font-medium">{journalEntries}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Habits</span>
                <span className="font-medium">{completedHabits}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Mindfulness Minutes</span>
                <span className="font-medium">{mindfulnessMinutes} mins</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-mindscape-primary/20">
              <h3 className="font-medium mb-2">This Week's Insight</h3>
              <div className="text-sm mb-4 p-3 bg-mindscape-light/30 rounded-lg min-h-16 max-h-32 overflow-y-auto">
                {getInsight(moodAverage)}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 h-auto py-2 px-4 whitespace-normal text-center"
                onClick={recommendation.action}
              >
                {recommendationText.length > 30 
                  ? recommendationText.split(' ').slice(0, 4).join(' ') + '...' 
                  : recommendationText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="pt-6 pb-2">
          <DrawerTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-mindscape-primary" />
            Weekly Summary
          </DrawerTitle>
          <DrawerDescription>
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4 h-[calc(100vh-150px)]">
          <DetailedWeeklyReport />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
  
  const DesktopDialog = (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="card-highlight cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mood Average</span>
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getMoodEmoji(moodAverage)}</span>
                  <span className="font-medium">{moodAverage}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Journal Entries</span>
                <span className="font-medium">{journalEntries}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Habits</span>
                <span className="font-medium">{completedHabits}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Mindfulness Minutes</span>
                <span className="font-medium">{mindfulnessMinutes} mins</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-mindscape-primary/20">
              <h3 className="font-medium mb-2">This Week's Insight</h3>
              <div className="text-sm mb-4 p-3 bg-mindscape-light/30 rounded-lg min-h-16 max-h-32 overflow-y-auto">
                {getInsight(moodAverage)}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 h-auto py-2 px-4 whitespace-normal text-center"
                onClick={recommendation.action}
              >
                {recommendationText.length > 30 
                  ? recommendationText.split(' ').slice(0, 4).join(' ') + '...' 
                  : recommendationText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-mindscape-primary" />
            Weekly Summary
          </DialogTitle>
          <DialogDescription>
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <DetailedWeeklyReport />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
  
  return isMobile ? MobileDrawer : DesktopDialog;
}
