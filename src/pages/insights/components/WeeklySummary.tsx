
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Calendar, CheckCircle, Target, BarChart2, Brain, Heart, Award } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  
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
  
  // Calculate mindfulness progress
  const weeklyMindfulnessGoal = 60; // 60 minutes per week
  const mindfulnessProgress = Math.min((mindfulnessMinutes / weeklyMindfulnessGoal) * 100, 100);
  
  // Calculate habit completion rate
  let habitCompletionRate = 0;
  if (completedHabits !== "No data") {
    const [completed, total] = completedHabits.split('/').map(Number);
    habitCompletionRate = Math.round((completed / total) * 100);
  }
  
  // Calculate journal consistency
  const journalGoal = 5; // 5 entries per week
  const journalProgress = Math.min((journalEntries / journalGoal) * 100, 100);
  
  // Calculate overall wellness score
  const calculateWellnessScore = (): number => {
    if (moodAverage === "No data" || completedHabits === "No data") {
      return 0;
    }
    
    // Convert mood to score out of 100
    let moodScore = 0;
    switch(moodAverage.toLowerCase()) {
      case 'amazing': moodScore = 100; break;
      case 'good': moodScore = 80; break;
      case 'okay': moodScore = 60; break;
      case 'sad': moodScore = 40; break;
      case 'awful': moodScore = 20; break;
      default: moodScore = 0;
    }
    
    // Combine all metrics for overall score
    const combinedScore = (
      moodScore + 
      habitCompletionRate + 
      (journalProgress) + 
      (mindfulnessProgress)
    ) / 4;
    
    return Math.round(combinedScore);
  };
  
  const wellnessScore = calculateWellnessScore();
  
  // Get wellness level
  const getWellnessLevel = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 45) return "Fair";
    if (score >= 30) return "Needs Attention";
    if (score > 0) return "Requires Focus";
    return "No Data";
  };
  
  const wellnessLevel = getWellnessLevel(wellnessScore);
  
  return (
    <>
      <Card className="card-highlight overflow-hidden relative">
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
            <h3 className="font-medium mb-2 flex items-center gap-1">
              <Award className="h-4 w-4 text-yellow-500" />
              This Week's Insight
            </h3>
            <div className="text-sm mb-4 p-3 bg-mindscape-light/30 rounded-lg min-h-16 max-h-32 overflow-y-auto">
              {getInsight(moodAverage)}
            </div>
            
            <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 h-auto py-2 px-4 flex items-center justify-between"
                >
                  <span>View Detailed Report</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] rounded-t-xl px-4 pb-8">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-xl flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-mindscape-primary" />
                    Weekly Wellness Report
                  </SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(90vh-80px)] px-1 pb-6">
                  {/* Overall Wellness Score */}
                  <div className="mb-6">
                    <div className="mb-2 flex justify-between items-center">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        Overall Wellness
                      </h3>
                      <span className={cn(
                        "text-sm px-2 py-0.5 rounded-full",
                        wellnessScore >= 75 ? "bg-green-100 text-green-700" :
                        wellnessScore >= 60 ? "bg-blue-100 text-blue-700" :
                        wellnessScore >= 45 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {wellnessLevel}
                      </span>
                    </div>
                    
                    <div className="relative h-12 flex items-center justify-center">
                      <div className="absolute inset-0">
                        <Progress value={wellnessScore} indicatorClassName={cn(
                          wellnessScore >= 75 ? "bg-green-500" :
                          wellnessScore >= 60 ? "bg-blue-500" :
                          wellnessScore >= 45 ? "bg-yellow-500" :
                          "bg-red-500"
                        )} />
                      </div>
                      <span className="relative text-lg font-bold z-10">{wellnessScore}%</span>
                    </div>
                  </div>
                  
                  {/* Section: Mood */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50/30 to-transparent border border-purple-100/50 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        <Brain className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Mood Status</h3>
                        <p className="text-xs text-muted-foreground">Your emotional wellbeing</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{getMoodEmoji(moodAverage)}</span>
                      <div>
                        <h4 className="font-medium">{moodAverage}</h4>
                        <p className="text-xs text-muted-foreground">weekly average</p>
                      </div>
                    </div>
                    
                    <p className="text-xs p-2 bg-background/50 rounded-md">
                      {getInsight(moodAverage)}
                    </p>
                  </div>
                  
                  {/* Section: Mindfulness */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50/30 to-transparent border border-blue-100/50 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Mindfulness Practice</h3>
                        <p className="text-xs text-muted-foreground">Your mental training</p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Goal: {weeklyMindfulnessGoal} mins</span>
                        <span>{mindfulnessMinutes} mins completed</span>
                      </div>
                      <Progress value={mindfulnessProgress} indicatorClassName="bg-blue-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="p-2 bg-background/60 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Sessions</p>
                        <p className="font-medium">{Math.ceil(mindfulnessMinutes / 10)}</p>
                      </div>
                      <div className="p-2 bg-background/60 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Avg Duration</p>
                        <p className="font-medium">
                          {mindfulnessMinutes > 0 
                            ? `${Math.round(mindfulnessMinutes / Math.ceil(mindfulnessMinutes / 10))} mins` 
                            : "0 mins"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section: Habits */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50/30 to-transparent border border-green-100/50 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Habit Consistency</h3>
                        <p className="text-xs text-muted-foreground">Your daily routines</p>
                      </div>
                    </div>
                    
                    {completedHabits !== "No data" ? (
                      <>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion Rate</span>
                            <span>{habitCompletionRate}%</span>
                          </div>
                          <Progress value={habitCompletionRate} indicatorClassName="bg-green-500" />
                        </div>
                        
                        <div className="mt-3 p-2 bg-background/60 rounded-md">
                          <p className="text-xs text-muted-foreground">Completed vs Total</p>
                          <p className="font-semibold text-center mt-1">{completedHabits}</p>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 bg-background/60 rounded-md text-center">
                        <p className="text-sm">No habit data for this week</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Section: Journal */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50/30 to-transparent border border-orange-100/50 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-full bg-orange-100">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Journal Activity</h3>
                        <p className="text-xs text-muted-foreground">Your personal reflections</p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Goal: {journalGoal} entries</span>
                        <span>{journalEntries} entries written</span>
                      </div>
                      <Progress value={journalProgress} indicatorClassName="bg-orange-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="p-2 bg-background/60 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Coverage</p>
                        <p className="font-medium">{Math.round(journalEntries / 7 * 100)}% of days</p>
                      </div>
                      <div className="p-2 bg-background/60 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Consistency</p>
                        <p className="font-medium">
                          {journalEntries > 3 ? "Good" : journalEntries > 1 ? "Fair" : "Needs work"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="p-4 rounded-lg bg-background border border-border mt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-mindscape-primary" />
                      Recommendations
                    </h3>
                    
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-auto py-3 px-4 text-left"
                        onClick={recommendation.action}
                      >
                        <div>
                          <p className="font-medium">{recommendationText}</p>
                          <p className="text-xs text-muted-foreground">Click to take action</p>
                        </div>
                      </Button>
                      
                      {moodAverage.toLowerCase() === 'sad' || moodAverage.toLowerCase() === 'awful' ? (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-auto py-3 px-4 text-left"
                          onClick={() => navigate('/mindful')}
                        >
                          <div>
                            <p className="font-medium">Try a breathing exercise for stress relief</p>
                            <p className="text-xs text-muted-foreground">Quick 5-minute sessions can help</p>
                          </div>
                        </Button>
                      ) : null}
                      
                      {mindfulnessMinutes < 20 && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-auto py-3 px-4 text-left"
                          onClick={() => navigate('/mindful')}
                        >
                          <div>
                            <p className="font-medium">Add at least one mindfulness session</p>
                            <p className="text-xs text-muted-foreground">Even 5 minutes can make a difference</p>
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            
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
    </>
  );
}
