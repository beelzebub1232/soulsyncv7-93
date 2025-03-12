
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ActivityLevelCardProps {
  activityLevel: number;
}

export function ActivityLevelCard({ activityLevel }: ActivityLevelCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Activity Level</h3>
            <Activity className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            {activityLevel >= 60
              ? "Great weekly progress on your wellness goals"
              : "Continue building healthy routines this week"}
          </p>
        </div>
        
        <Progress 
          className="h-2 mt-3"
          value={activityLevel}
          indicatorClassName="bg-gradient-to-r from-purple-300 to-purple-500"
        />
      </CardContent>
    </Card>
  );
}
