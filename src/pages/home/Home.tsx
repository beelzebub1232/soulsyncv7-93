
import { useUser } from "@/contexts/UserContext";
import { MoodTracker } from "./components/MoodTracker";
import { DailyMotivation } from "./components/DailyMotivation";
import { UpcomingHabits } from "./components/UpcomingHabits";
import { RecentJournals } from "./components/RecentJournals";

export default function Home() {
  const { user } = useUser();
  
  return (
    <div className="space-y-8">
      <header className="pt-2 bg-gradient-to-r from-mindscape-light/30 to-transparent p-4 rounded-xl">
        <h1 className="text-2xl font-bold font-display text-mindscape-primary">
          Hi, {user?.username || 'Friend'}!
        </h1>
        <p className="text-muted-foreground">How are you feeling today?</p>
      </header>
      
      <MoodTracker />
      
      <div className="relative">
        <div className="absolute -z-10 top-1/2 left-12 w-24 h-24 rounded-full bg-mindscape-light/20 blur-xl"></div>
        <div className="absolute -z-10 bottom-8 right-8 w-32 h-32 rounded-full bg-blue-100/30 blur-xl"></div>
        <DailyMotivation />
      </div>
      
      <div className="space-y-4 bg-gradient-to-br from-blue-50/50 to-transparent p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary">Today's Habits</h2>
          <a href="/habit-tracker" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <UpcomingHabits />
      </div>
      
      <div className="space-y-4 bg-gradient-to-bl from-mindscape-light/20 to-transparent p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary">Recent Journal Entries</h2>
          <a href="/journal" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <RecentJournals />
      </div>
      
      <div className="fixed -z-10 top-20 right-0 w-64 h-64 rounded-full bg-purple-100/30 blur-3xl opacity-70"></div>
      <div className="fixed -z-10 bottom-20 left-10 w-40 h-40 rounded-full bg-blue-100/20 blur-2xl opacity-60"></div>
    </div>
  );
}
