
import { useUser } from "@/contexts/UserContext";
import { useInsights } from "./useInsights";
import { MoodTrendCard } from "./MoodTrendCard";
import { JournalConsistencyCard } from "./JournalConsistencyCard";
import { HabitStreaksCard } from "./HabitStreaksCard";
import { ActivityLevelCard } from "./ActivityLevelCard";

export function WeeklyInsights() {
  const { user } = useUser();
  const insights = useInsights(user?.id);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="h-40">
        <MoodTrendCard moodTrend={insights.moodTrend} />
      </div>
      <div className="h-40">
        <JournalConsistencyCard journalConsistency={insights.journalConsistency} />
      </div>
      <div className="h-40">
        <HabitStreaksCard habitStreaks={insights.habitStreaks} />
      </div>
      <div className="h-40">
        <ActivityLevelCard activityLevel={insights.activityLevel} />
      </div>
    </div>
  );
}
