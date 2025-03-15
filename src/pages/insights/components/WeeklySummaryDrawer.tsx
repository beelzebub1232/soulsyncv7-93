
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Calendar, Brain, Wind, Clock, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ProgressLogItem } from "@/pages/mindful/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WeeklySummaryDrawerProps {
  weeklyData: {
    moodScore: number;
    journalCount: number;
    habitCompletionRate: number;
    mindfulMinutes: number;
    mindfulSessions: ProgressLogItem[];
    startDate: Date;
    endDate: Date;
  };
}

export default function WeeklySummaryDrawer({ weeklyData }: WeeklySummaryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatSessionDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Calculate overall wellbeing score based on all metrics
  const wellbeingScore = Math.round(
    (weeklyData.moodScore * 0.3) + 
    (weeklyData.journalCount * 5 * 0.2) + 
    (weeklyData.habitCompletionRate * 0.3) + 
    (Math.min(weeklyData.mindfulMinutes / 60, 1) * 0.2) * 100
  );
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between font-normal h-auto py-3 px-4"
        >
          <span>View Detailed Report</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
        <ScrollArea className="h-full pr-4">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Weekly Wellness Report</SheetTitle>
            <SheetDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {weeklyData.startDate.toLocaleDateString()} - {weeklyData.endDate.toLocaleDateString()}
              </span>
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">Overall Wellbeing Score</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{wellbeingScore}%</span>
                  <span className="text-muted-foreground">
                    {wellbeingScore < 40 ? "Needs attention" : 
                     wellbeingScore < 70 ? "Good" : "Excellent"}
                  </span>
                </div>
                <Progress value={wellbeingScore} className="h-2" />
              </div>
            </Card>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
              <Card className={cn(
                "p-4 border-l-4", 
                weeklyData.moodScore < 0.4 ? "border-l-red-400" :
                weeklyData.moodScore < 0.7 ? "border-l-yellow-400" : "border-l-green-400"
              )}>
                <h3 className="text-xs font-medium">Mood Score</h3>
                <p className="text-2xl font-bold mt-1">{Math.round(weeklyData.moodScore * 100)}%</p>
              </Card>
              
              <Card className={cn(
                "p-4 border-l-4", 
                weeklyData.journalCount === 0 ? "border-l-red-400" :
                weeklyData.journalCount < 3 ? "border-l-yellow-400" : "border-l-green-400"
              )}>
                <h3 className="text-xs font-medium">Journal Entries</h3>
                <p className="text-2xl font-bold mt-1">{weeklyData.journalCount}</p>
              </Card>
              
              <Card className={cn(
                "p-4 border-l-4", 
                weeklyData.habitCompletionRate < 0.4 ? "border-l-red-400" :
                weeklyData.habitCompletionRate < 0.7 ? "border-l-yellow-400" : "border-l-green-400"
              )}>
                <h3 className="text-xs font-medium">Habit Completion</h3>
                <p className="text-2xl font-bold mt-1">{Math.round(weeklyData.habitCompletionRate * 100)}%</p>
              </Card>
              
              <Card className={cn(
                "p-4 border-l-4", 
                weeklyData.mindfulMinutes < 15 ? "border-l-red-400" :
                weeklyData.mindfulMinutes < 30 ? "border-l-yellow-400" : "border-l-green-400"
              )}>
                <h3 className="text-xs font-medium">Mindfulness</h3>
                <p className="text-2xl font-bold mt-1">{weeklyData.mindfulMinutes} min</p>
              </Card>
            </div>
            
            {/* Mindfulness Sessions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Mindfulness Sessions</h3>
              {weeklyData.mindfulSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No mindfulness sessions this week</p>
              ) : (
                <div className="space-y-2">
                  {weeklyData.mindfulSessions.map((session, index) => (
                    <Card key={index} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          session.exerciseType === "breathing" ? "bg-blue-100" : "bg-purple-100"
                        )}>
                          {session.exerciseType === "breathing" ? (
                            <Wind className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Brain className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{session.exerciseType} Exercise</p>
                          <p className="text-xs text-muted-foreground">{formatSessionDate(session.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{session.duration} min</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Personalized Recommendations</h3>
              <Card className="p-4 space-y-3">
                {wellbeingScore < 50 && (
                  <div className="flex gap-3">
                    <div className="p-2 bg-blue-100 rounded-full h-fit">
                      <Wind className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm">Try daily breathing exercises to help reduce stress levels</p>
                  </div>
                )}
                
                {weeklyData.journalCount < 3 && (
                  <div className="flex gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full h-fit">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                    </div>
                    <p className="text-sm">Journaling more frequently can help process emotions</p>
                  </div>
                )}
                
                {weeklyData.mindfulMinutes < 30 && (
                  <div className="flex gap-3">
                    <div className="p-2 bg-purple-100 rounded-full h-fit">
                      <Brain className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm">Aim for at least 30 minutes of mindfulness practice each week</p>
                  </div>
                )}
                
                {wellbeingScore >= 70 && (
                  <div className="flex gap-3">
                    <div className="p-2 bg-green-100 rounded-full h-fit">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm">Great work! Continue your current wellness practices</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
