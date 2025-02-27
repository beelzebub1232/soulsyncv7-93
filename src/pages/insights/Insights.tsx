
import { useState, useEffect } from "react";
import { BarChart, Calendar, LineChart, PieChart, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoodCalendar } from "./components/MoodCalendar";
import { MoodTrends } from "./components/MoodTrends";
import { EmotionAnalysis } from "./components/EmotionAnalysis";
import { HabitProgress } from "./components/HabitProgress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

export default function Insights() {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [moodData, setMoodData] = useState<any[]>([]);
  const [habitData, setHabitData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch mood data
        let moodEntries = [];
        
        if (user?.id) {
          // Try to get from Supabase first
          const { data: supabaseMoods, error } = await supabase
            .from('moods')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (!error && supabaseMoods) {
            moodEntries = supabaseMoods;
          }
        }
        
        // Fallback to localStorage if no data or not logged in
        if (moodEntries.length === 0) {
          const storedMoods = localStorage.getItem('soulsync_moods');
          if (storedMoods) {
            moodEntries = JSON.parse(storedMoods);
          }
        }
        
        setMoodData(moodEntries);
        
        // Fetch habit data
        let habitEntries = [];
        
        if (user?.id) {
          // Try to get from Supabase
          const { data: supabaseHabits, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user.id);
            
          if (!error && supabaseHabits) {
            habitEntries = supabaseHabits;
          }
        }
        
        // Fallback to localStorage
        if (habitEntries.length === 0) {
          const storedHabits = localStorage.getItem('soulsync_habits');
          if (storedHabits) {
            habitEntries = JSON.parse(storedHabits);
          }
        }
        
        setHabitData(habitEntries);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load insights",
          description: "There was a problem loading your data."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user?.id, toast]);

  // Calculate weekly statistics
  const calculateWeeklySummary = () => {
    const defaultSummary = {
      moodAverage: "No data",
      journalEntries: 0,
      completedHabits: 0,
      totalHabits: 0,
      mindfulnessMinutes: 0
    };
    
    if (moodData.length === 0) return defaultSummary;
    
    // Get this week's moods
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekMoods = moodData.filter(mood => {
      const moodDate = new Date(mood.date || mood.created_at);
      return moodDate >= oneWeekAgo;
    });
    
    // Calculate mood average
    if (thisWeekMoods.length === 0) {
      return { ...defaultSummary };
    }
    
    const moodValues: Record<string, number> = {
      "amazing": 5,
      "good": 4,
      "okay": 3,
      "sad": 2,
      "awful": 1
    };
    
    const moodSum = thisWeekMoods.reduce((sum, mood) => {
      const moodValue = mood.value || mood.mood;
      return sum + (moodValues[moodValue] || 3);
    }, 0);
    
    const avgMoodScore = moodSum / thisWeekMoods.length;
    
    let moodText = "Neutral";
    if (avgMoodScore >= 4.5) moodText = "Amazing";
    else if (avgMoodScore >= 3.5) moodText = "Good";
    else if (avgMoodScore >= 2.5) moodText = "Okay";
    else if (avgMoodScore >= 1.5) moodText = "Sad";
    else moodText = "Awful";
    
    // Get journal entries count
    const storedEntries = localStorage.getItem('soulsync_journal');
    const journalEntries = storedEntries ? JSON.parse(storedEntries).filter((entry: any) => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo;
    }).length : 0;
    
    // Get habits completion
    const completedHabits = habitData.filter(habit => habit.completed).length;
    
    // Get mindfulness minutes (placeholder - would fetch from actual user data)
    const mindfulnessMinutes = 45; // Placeholder
    
    return {
      moodAverage: moodText,
      journalEntries,
      completedHabits,
      totalHabits: habitData.length,
      mindfulnessMinutes
    };
  };

  const weeklySummary = calculateWeeklySummary();
  
  const handleViewDetailedReport = () => {
    setActiveTab("reports");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-display">Insights</h1>
        <p className="text-muted-foreground">Track your progress and patterns</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="reports">Detailed Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("moodCalendar")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-mindscape-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Mood Calendar</CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("moodTrends")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
                  <LineChart className="h-5 w-5 text-mindscape-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Mood Trends</CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("emotionAnalysis")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
                  <PieChart className="h-5 w-5 text-mindscape-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Emotion Analysis</CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("habitProgress")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
                  <BarChart className="h-5 w-5 text-mindscape-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Habit Progress</CardTitle>
              </CardHeader>
            </Card>
          </div>
          
          <Card className="card-highlight border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Weekly Summary</CardTitle>
              <CardDescription>Your past 7 days at a glance</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mood Average</span>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {weeklySummary.moodAverage === "Amazing" && "😄"}
                      {weeklySummary.moodAverage === "Good" && "🙂"}
                      {weeklySummary.moodAverage === "Okay" && "😐"}
                      {weeklySummary.moodAverage === "Sad" && "🙁"}
                      {weeklySummary.moodAverage === "Awful" && "😢"}
                      {weeklySummary.moodAverage === "No data" && "📊"}
                    </span>
                    <span className="font-medium">{weeklySummary.moodAverage}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Journal Entries</span>
                  <span className="font-medium">{weeklySummary.journalEntries}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed Habits</span>
                  <span className="font-medium">{weeklySummary.completedHabits}/{weeklySummary.totalHabits}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mindfulness Minutes</span>
                  <span className="font-medium">{weeklySummary.mindfulnessMinutes} mins</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-mindscape-primary/20">
                <h3 className="font-medium mb-2">This Week's Insight</h3>
                <p className="text-sm">
                  {moodData.length > 0 
                    ? "Your mood tends to improve on days you complete your morning meditation habit. Keep it up!"
                    : "Start tracking your mood and habits to receive personalized insights!"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <button className="button-secondary" onClick={handleViewDetailedReport}>
              View Detailed Reports
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("moodCalendar")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-mindscape-primary" />
                    <span>Mood Calendar</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>View your mood patterns over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-sm text-muted-foreground">
                  Track your emotional journey with a visual calendar showing your daily moods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("moodTrends")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-mindscape-primary" />
                    <span>Mood Trends</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Analyze your mood over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-sm text-muted-foreground">
                  Visualize how your mood fluctuates and identify patterns and triggers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("emotionAnalysis")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-mindscape-primary" />
                    <span>Emotion Analysis</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Understand your emotional patterns</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-sm text-muted-foreground">
                  See the breakdown of your emotions and what factors correlate with each mood.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all" onClick={() => setActiveTab("habitProgress")}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-mindscape-primary" />
                    <span>Habit Progress</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Track your habit consistency</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-sm text-muted-foreground">
                  See which habits you're most consistent with and where you can improve.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="moodCalendar">
          <MoodCalendar moodData={moodData} onBack={() => setActiveTab("summary")} />
        </TabsContent>
        
        <TabsContent value="moodTrends">
          <MoodTrends moodData={moodData} onBack={() => setActiveTab("summary")} />
        </TabsContent>
        
        <TabsContent value="emotionAnalysis">
          <EmotionAnalysis moodData={moodData} onBack={() => setActiveTab("summary")} />
        </TabsContent>
        
        <TabsContent value="habitProgress">
          <HabitProgress habitData={habitData} onBack={() => setActiveTab("summary")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
