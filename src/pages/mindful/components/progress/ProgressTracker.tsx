
import { useState, useEffect } from "react";
import { Calendar, BarChart3, Wind, Flower, History, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressLogItem } from "../../types";
import { cn } from "@/lib/utils";
import * as mindfulStorage from "../../services/mindfulStorage";
import { breathingExercises } from "../../data/breathingExercises";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";
import { formatDistanceToNow } from "date-fns";

export default function ProgressTracker() {
  const [completions, setCompletions] = useState<ProgressLogItem[]>([]);
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    // Load exercise completions from storage
    const storedCompletions = mindfulStorage.getProgressLog();
    setCompletions(storedCompletions);
  }, []);

  // Calculate total minutes for each type
  const totalBreathingMinutes = completions
    .filter(c => c.exerciseType === "breathing")
    .reduce((sum, c) => sum + c.duration, 0);

  const totalMindfulnessMinutes = completions
    .filter(c => c.exerciseType === "mindfulness")
    .reduce((sum, c) => sum + c.duration, 0);
    
  const totalMinutes = totalBreathingMinutes + totalMindfulnessMinutes;
  
  // Get exercise names by ID
  const getExerciseName = (id: string, type: "breathing" | "mindfulness"): string => {
    if (type === "breathing") {
      const exercise = breathingExercises.find(e => e.id === id);
      return exercise?.name || "Unknown Exercise";
    } else {
      const exercise = mindfulnessExercises.find(e => e.id === id);
      return exercise?.name || "Unknown Exercise";
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Sort completions by date (newest first)
  const sortedCompletions = [...completions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <History className="h-5 w-5 text-mindscape-primary" />
          Your Mindfulness Journey
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-8 w-8 mb-2 text-mindscape-primary" />
              <h3 className="text-sm font-medium mb-1">Total Practice Time</h3>
              <p className="text-2xl font-bold">{totalMinutes} min</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Wind className="h-8 w-8 mb-2 text-blue-500" />
              <h3 className="text-sm font-medium mb-1">Breathing Exercises</h3>
              <p className="text-2xl font-bold">{completions.filter(c => c.exerciseType === "breathing").length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Flower className="h-8 w-8 mb-2 text-purple-500" />
              <h3 className="text-sm font-medium mb-1">Mindfulness Sessions</h3>
              <p className="text-2xl font-bold">{completions.filter(c => c.exerciseType === "mindfulness").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Practice Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span>Breathing</span>
                </span>
                <span>{totalBreathingMinutes} min ({totalMinutes > 0 ? Math.round((totalBreathingMinutes / totalMinutes) * 100) : 0}%)</span>
              </div>
              <Progress 
                value={totalMinutes > 0 ? (totalBreathingMinutes / totalMinutes) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Flower className="h-4 w-4 text-purple-500" />
                  <span>Mindfulness</span>
                </span>
                <span>{totalMindfulnessMinutes} min ({totalMinutes > 0 ? Math.round((totalMindfulnessMinutes / totalMinutes) * 100) : 0}%)</span>
              </div>
              <Progress 
                value={totalMinutes > 0 ? (totalMindfulnessMinutes / totalMinutes) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="history" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Session History
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-4">
          {sortedCompletions.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
              <h3 className="text-lg font-medium">No sessions yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete a breathing or mindfulness exercise to start tracking your progress
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {sortedCompletions.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          item.exerciseType === "breathing" ? "bg-blue-100" : "bg-purple-100"
                        )}>
                          {item.exerciseType === "breathing" ? (
                            <Wind className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Flower className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{getExerciseName(item.exerciseId, item.exerciseType)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.duration} min</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-base font-medium mb-1">Weekly Practice Goal</h3>
                  <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10" 
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="hsl(var(--mindscape-primary))"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - Math.min(1, totalMinutes / 60))}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute">
                      <p className="text-3xl font-bold">{Math.round((totalMinutes / 60) * 100)}%</p>
                      <p className="text-xs text-muted-foreground">of 60 min goal</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Most Practiced Exercise Types</h3>
                  
                  <div className="space-y-4">
                    {completions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">No data yet</p>
                    ) : (
                      <>
                        {/* Exercise frequency analysis would go here */}
                        <p className="text-sm text-center py-2">
                          Continue practicing to see more detailed statistics
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
