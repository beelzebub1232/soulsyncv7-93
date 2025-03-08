
import { useUser } from "@/contexts/UserContext";
import { MoodTracker } from "./components/MoodTracker";
import { DailyMotivation } from "./components/DailyMotivation";
import { UpcomingHabits } from "./components/UpcomingHabits";
import { RecentJournals } from "./components/RecentJournals";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  return (
    <div className="space-y-8">
      <header className="pt-2 bg-gradient-to-r from-mindscape-light/30 to-transparent p-4 rounded-xl relative overflow-hidden">
        <div className="animate-pulse absolute -z-10 top-0 right-0 w-12 h-12 rounded-full bg-blue-100/40 blur-lg"></div>
        <div className="animate-pulse absolute -z-10 top-16 left-12 w-8 h-8 rounded-full bg-purple-100/30 blur-md delay-300"></div>
        
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-display text-mindscape-primary animate-fade-in">
              <span className="mr-2">{greeting},</span>
              <span className="relative inline-block">
                {user?.username || 'Friend'}
                <span className="absolute -right-6 top-0">
                  <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground">How are you feeling today?</p>
          </div>
          <NotificationsPanel />
        </div>
      </header>
      
      <MoodTracker />
      
      <div className="relative">
        <div className="absolute -z-10 top-1/2 left-12 w-24 h-24 rounded-full bg-mindscape-light/20 blur-xl"></div>
        <div className="absolute -z-10 bottom-8 right-8 w-32 h-32 rounded-full bg-blue-100/30 blur-xl"></div>
        <DailyMotivation />
      </div>
      
      <div className="space-y-4 bg-gradient-to-br from-blue-50/50 to-transparent p-5 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary">Today's Habits</h2>
          <a href="/habit-tracker" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <div className="min-h-[180px]">
          <UpcomingHabits />
        </div>
      </div>
      
      <div className="space-y-4 bg-gradient-to-bl from-mindscape-light/20 to-transparent p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary">Recent Journal Entries</h2>
          <a href="/journal" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <RecentJournals />
      </div>
      
      <div className="card-primary p-5 bg-gradient-to-r from-mindscape-light/40 to-transparent">
        <h2 className="text-lg font-semibold text-mindscape-tertiary mb-3">Weekly Reflections</h2>
        <p className="text-muted-foreground mb-4">Take a moment to reflect on your week and see your progress.</p>
        <div className="flex justify-center">
          <a href="/insights" className="button-secondary">View Insights</a>
        </div>
      </div>
      
      <div className="fixed -z-10 top-20 right-0 w-64 h-64 rounded-full bg-purple-100/30 blur-3xl opacity-70"></div>
      <div className="fixed -z-10 bottom-20 left-10 w-40 h-40 rounded-full bg-blue-100/20 blur-2xl opacity-60"></div>
    </div>
  );
}
