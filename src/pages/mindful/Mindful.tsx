
import { useUser } from "@/contexts/UserContext";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindfulHeader from "./components/MindfulHeader";
import BreathingExercises from "./components/breathing/BreathingExercises";
import MindfulnessExercises from "./components/mindfulness/MindfulnessExercises";
import MentalHealthQuiz from "./components/quiz/MentalHealthQuiz";
import ProgressTracker from "./components/progress/ProgressTracker";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Flower, Heart, Shield, CloudSun, PanelRightOpen, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { mindfulSummaryStats } from "./data/summaryData";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { MindfulnessSession, ProgressLogItem } from "./types";
import { toast } from "sonner";

export default function Mindful() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("breathing");
  const [showStatsInfo, setShowStatsInfo] = useState<string | null>(null);
  const [progressLog, setProgressLog] = useLocalStorage<ProgressLogItem[]>("mindful-progress-log", []);
  const [totalSessions, setTotalSessions] = useLocalStorage<number>("mindful-total-sessions", 0);
  const [totalMinutes, setTotalMinutes] = useLocalStorage<number>("mindful-total-minutes", 0);
  const [currentStreak, setCurrentStreak] = useLocalStorage<number>("mindful-current-streak", 0);
  const [bestStreak, setBestStreak] = useLocalStorage<number>("mindful-best-streak", 0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const logSession = (exerciseId: string, exerciseType: "breathing" | "mindfulness", duration: number) => {
    const now = new Date();
    const newLogItem: ProgressLogItem = {
      id: crypto.randomUUID(),
      date: now.toISOString(),
      exerciseId,
      exerciseType,
      duration
    };
    
    // Update progress log
    setProgressLog(prev => [...prev, newLogItem]);
    
    // Update total sessions count
    setTotalSessions(prev => prev + 1);
    
    // Update total minutes
    setTotalMinutes(prev => prev + duration);
    
    // Update streak
    updateStreak();
    
    // Add mindfulness data to insights
    const mindfulnessStorageKey = `soulsync_mindfulness_${user?.id}`;
    let mindfulnessData: MindfulnessSession[] = [];
    
    try {
      const storedData = localStorage.getItem(mindfulnessStorageKey);
      if (storedData) {
        mindfulnessData = JSON.parse(storedData);
      }
      
      mindfulnessData.push({
        id: newLogItem.id,
        date: newLogItem.date,
        exerciseName: exerciseType === "breathing" ? "Breathing Exercise" : "Mindfulness Exercise",
        minutes: duration
      });
      
      localStorage.setItem(mindfulnessStorageKey, JSON.stringify(mindfulnessData));
      
      // Trigger event to update insights
      window.dispatchEvent(new Event('soulsync_data_updated'));
      
      toast.success(`${duration} minutes of mindfulness added to your progress!`);
    } catch (error) {
      console.error("Error saving mindfulness data:", error);
    }
  };
  
  const updateStreak = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    
    if (progressLog.length > 0) {
      // Find the last session date
      const lastSessionDate = new Date(progressLog[progressLog.length - 1].date);
      lastSessionDate.setHours(0, 0, 0, 0); // Start of the last session day
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1); // Start of yesterday
      
      if (lastSessionDate.getTime() === yesterday.getTime()) {
        // Last session was yesterday, increment streak
        setCurrentStreak(prev => {
          const newStreak = prev + 1;
          // Update best streak if needed
          if (newStreak > bestStreak) {
            setBestStreak(newStreak);
          }
          return newStreak;
        });
      } else if (lastSessionDate.getTime() < yesterday.getTime()) {
        // Last session was before yesterday, reset streak
        setCurrentStreak(1);
      }
      // If last session was today, no need to update streak
    } else {
      // First session ever
      setCurrentStreak(1);
      setBestStreak(1);
    }
  };
  
  const scrollToTop = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  return (
    <div className="space-y-4" ref={contentRef}>
      <MindfulHeader username={user?.username || 'Friend'} />
      
      {/* Summary Stats - Mobile-optimized */}
      <div className="relative mb-2">
        <ScrollArea className="w-full pb-2">
          <div className="flex gap-3 px-1 pb-1 w-max min-w-full">
            {mindfulSummaryStats.map(stat => (
              <Card 
                key={stat.id}
                className={cn(
                  "w-36 flex-shrink-0 overflow-hidden border-border/50 transition-all hover:shadow-md",
                  stat.color === "purple" && "bg-gradient-to-br from-purple-50/30 to-transparent",
                  stat.color === "blue" && "bg-gradient-to-br from-blue-50/30 to-transparent",
                  stat.color === "orange" && "bg-gradient-to-br from-orange-50/30 to-transparent",
                  stat.color === "green" && "bg-gradient-to-br from-green-50/30 to-transparent"
                )}
                onClick={() => setShowStatsInfo(stat.id)}
              >
                <CardContent className="p-3 flex items-start gap-2">
                  <div className={cn(
                    "p-1.5 rounded-full",
                    stat.color === "purple" && "bg-purple-100",
                    stat.color === "blue" && "bg-blue-100",
                    stat.color === "orange" && "bg-orange-100",
                    stat.color === "green" && "bg-green-100"
                  )}>
                    <stat.icon className={cn(
                      "h-4 w-4",
                      stat.color === "purple" && "text-purple-600",
                      stat.color === "blue" && "text-blue-600",
                      stat.color === "orange" && "text-orange-500",
                      stat.color === "green" && "text-green-600"
                    )} />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="text-xs font-medium line-clamp-1">{stat.title}</CardTitle>
                    <CardDescription className="text-[10px] line-clamp-2">{stat.description}</CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        {/* Stat details sheet */}
        {showStatsInfo && (
          <div 
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={() => setShowStatsInfo(null)}
          >
            <div 
              className="bg-background rounded-lg p-5 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {mindfulSummaryStats.find(s => s.id === showStatsInfo) && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "purple" && "bg-purple-100",
                      mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "blue" && "bg-blue-100",
                      mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "orange" && "bg-orange-100",
                      mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "green" && "bg-green-100"
                    )}>
                      {mindfulSummaryStats.find(s => s.id === showStatsInfo)?.icon && (
                        <mindfulSummaryStats.find(s => s.id === showStatsInfo)!.icon className={cn(
                          "h-5 w-5",
                          mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "purple" && "text-purple-600",
                          mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "blue" && "text-blue-600",
                          mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "orange" && "text-orange-500",
                          mindfulSummaryStats.find(s => s.id === showStatsInfo)?.color === "green" && "text-green-600"
                        )} />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {mindfulSummaryStats.find(s => s.id === showStatsInfo)?.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm mb-4">
                    {mindfulSummaryStats.find(s => s.id === showStatsInfo)?.description}
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <p><strong>Regular Practice:</strong> Daily mindfulness of just 10 minutes can boost these benefits over time.</p>
                    <p><strong>Scientific Research:</strong> Studies show measurable improvements after 8 weeks of consistent practice.</p>
                    <p><strong>Your Progress:</strong> You've spent {totalMinutes} minutes practicing mindfulness so far.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <div className="absolute -z-10 top-1/3 left-1/4 w-40 h-40 rounded-full bg-purple-100/20 blur-3xl"></div>
        <div className="absolute -z-10 bottom-0 right-1/4 w-40 h-40 rounded-full bg-blue-100/20 blur-3xl"></div>
        
        {/* Mobile-optimized tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            scrollToTop();
          }}
          className="w-full"
        >
          <div className="mb-6 overflow-hidden">
            <TabsList className="w-full flex bg-background/50 backdrop-blur-md border border-border/50 rounded-full p-1 overflow-x-auto scrollbar-hide">
              <TabsTrigger 
                value="breathing" 
                className="flex-1 min-w-[80px] rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary text-sm"
              >
                Breathing
              </TabsTrigger>
              <TabsTrigger 
                value="mindfulness" 
                className="flex-1 min-w-[80px] rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary text-sm"
              >
                Mindfulness
              </TabsTrigger>
              <TabsTrigger 
                value="quiz" 
                className="flex-1 min-w-[80px] rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary text-sm"
              >
                Quiz
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="flex-1 min-w-[80px] rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary text-sm"
              >
                Progress
              </TabsTrigger>
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="breathing" className="mt-0">
                <BreathingExercises onSessionComplete={(id, duration) => logSession(id, "breathing", duration)} />
              </TabsContent>
              
              <TabsContent value="mindfulness" className="mt-0">
                <MindfulnessExercises onSessionComplete={(id, duration) => logSession(id, "mindfulness", duration)} />
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-0">
                <MentalHealthQuiz />
              </TabsContent>
              
              <TabsContent value="progress" className="mt-0">
                <ProgressTracker />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
      
      {/* Floating Action Button - Enhanced with Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <div className={cn(
            "fixed bottom-20 right-6 z-30 p-4 rounded-full bg-mindscape-light shadow-md",
            "transition-all hover:bg-mindscape-light/90 active:scale-95"
          )}>
            <Flower className="text-mindscape-primary w-6 h-6" />
          </div>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[60vh]">
          <div className="pt-4 pb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Flower className="h-5 w-5 text-mindscape-primary" />
              Mindfulness Tips
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Quick ways to integrate mindfulness into your day</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-mindscape-light/30 rounded-lg">
                <h4 className="font-medium text-sm">Morning Routine</h4>
                <p className="text-xs mt-1">Start with 2 minutes of deep breathing before checking your phone.</p>
              </div>
              
              <div className="p-3 bg-mindscape-light/30 rounded-lg">
                <h4 className="font-medium text-sm">Mindful Walking</h4>
                <p className="text-xs mt-1">Pay attention to each step during a short walk. Notice the sensations of movement.</p>
              </div>
              
              <div className="p-3 bg-mindscape-light/30 rounded-lg">
                <h4 className="font-medium text-sm">Mindful Eating</h4>
                <p className="text-xs mt-1">For one meal today, eat slowly and focus on flavors, textures, and your body's signals.</p>
              </div>
              
              <div className="p-3 bg-mindscape-light/30 rounded-lg">
                <h4 className="font-medium text-sm">Micro-Breaks</h4>
                <p className="text-xs mt-1">Take 30-second breaks throughout your day to close your eyes and breathe deeply.</p>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                  You've practiced mindfulness for {totalMinutes} minutes.<br/>
                  Keep going! Your brain thanks you.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
