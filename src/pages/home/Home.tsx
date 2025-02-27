
import { useUser } from "@/contexts/UserContext";
import { MoodTracker } from "./components/MoodTracker";
import { DailyMotivation } from "./components/DailyMotivation";
import { UpcomingHabits } from "./components/UpcomingHabits";
import { RecentJournals } from "./components/RecentJournals";

export default function Home() {
  const { user } = useUser();
  
  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold font-display">
          Hi, {user?.username || 'Friend'}!
        </h1>
        <p className="text-muted-foreground">How are you feeling today?</p>
      </header>
      
      <MoodTracker />
      
      <DailyMotivation />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Habits</h2>
          <a href="/habit-tracker" className="text-sm text-primary">View all</a>
        </div>
        <UpcomingHabits />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Journal Entries</h2>
          <a href="/journal" className="text-sm text-primary">View all</a>
        </div>
        <RecentJournals />
      </div>
    </div>
  );
}
