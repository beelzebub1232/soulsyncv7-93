
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MoodTrendCardProps {
  moodTrend: number;
}

export function MoodTrendCard({ moodTrend }: MoodTrendCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Mood Trend</h3>
            {moodTrend >= 0 ? (
              <ThumbsUp className="h-5 w-5 text-green-500" />
            ) : (
              <ThumbsDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {moodTrend >= 0 
              ? "Your mood has been improving" 
              : "Your mood has been declining"}
          </p>
        </div>
        
        <Progress 
          className="h-2 mt-3"
          value={Math.min(100, Math.max(30, Math.abs(moodTrend) + 50))}
          indicatorClassName={moodTrend >= 0 
            ? "bg-gradient-to-r from-green-300 to-green-500" 
            : "bg-gradient-to-r from-orange-300 to-red-400"}
        />
      </CardContent>
    </Card>
  );
}
