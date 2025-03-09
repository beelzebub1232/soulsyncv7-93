
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MoodTrendCardProps {
  moodTrend: number;
}

export function MoodTrendCard({ moodTrend }: MoodTrendCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium">Mood Trend</h3>
          <div className={`flex items-center gap-1 ${moodTrend >= 0 ? 'text-green-500' : 'text-red-500'} text-xs`}>
            {moodTrend >= 0 ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span>{Math.abs(moodTrend)}%</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {moodTrend >= 0 
            ? "Your mood has been improving" 
            : "Your mood has been declining"}
        </p>
        <Progress 
          className="h-2"
          value={Math.min(100, Math.max(30, Math.abs(moodTrend) + 50))}
          indicatorClassName={moodTrend >= 0 
            ? "bg-gradient-to-r from-green-300 to-green-500" 
            : "bg-gradient-to-r from-orange-300 to-red-400"}
        />
      </CardContent>
    </Card>
  );
}
