
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HabitStreaksCardProps {
  habitStreaks: number;
}

export function HabitStreaksCard({ habitStreaks }: HabitStreaksCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium">Habit Streaks</h3>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {habitStreaks >= 50 
            ? "You're building good habits" 
            : "Keep working on your habits"}
        </p>
        <p className="text-xs text-right text-muted-foreground mb-1">
          {habitStreaks}% consistency
        </p>
        <Progress 
          className="h-2"
          value={habitStreaks}
          indicatorClassName="bg-gradient-to-r from-indigo-300 to-indigo-500"
        />
      </CardContent>
    </Card>
  );
}
