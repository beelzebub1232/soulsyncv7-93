
import { DailyMotivation } from "./daily-motivation";
import { useMood } from "./mood-tracker/use-mood";

export function DailyMotivation() {
  const { selectedMood } = useMood();
  
  return <DailyMotivation selectedMood={selectedMood} />;
}
