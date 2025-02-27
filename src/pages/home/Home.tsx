
import { useUser } from "@/contexts/UserContext";
import { MoodTracker } from "./components/MoodTracker";
import { DailyMotivation } from "./components/DailyMotivation";
import { UpcomingHabits } from "./components/UpcomingHabits";
import { RecentJournals } from "./components/RecentJournals";
import { Card, CardContent } from "@/components/ui/card";
import { HollowHeartIcon } from "@/components/icons/HeartIcon";

export default function Home() {
  const { user } = useUser();
  
  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-mindscape-light to-mindscape-light/30 overflow-hidden relative">
        <CardContent className="p-6">
          <div className="absolute top-[-20px] right-[-20px] opacity-10">
            <HollowHeartIcon className="h-32 w-32 text-mindscape-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display">
            Hi, {user?.username || 'Friend'}!
          </h1>
          <p className="text-muted-foreground">Welcome to SoulSync, your mental wellness companion.</p>
        </CardContent>
      </Card>
      
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
