
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HabitStreaksCardProps {
  habitStreaks: number;
}

export function HabitStreaksCard({ habitStreaks }: HabitStreaksCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Habit Streaks</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            {habitStreaks >= 50 
              ? "You're building good habits consistently" 
              : "Keep working on your daily habits"}
          </p>
        </div>
        <Progress 
          className="h-2 mt-3"
          value={habitStreaks}
          indicatorClassName="bg-gradient-to-r from-indigo-300 to-indigo-500"
        />
      </CardContent>
    </Card>
  );
}
