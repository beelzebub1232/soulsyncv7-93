
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ActivityLevelCardProps {
  activityLevel: number;
}

export function ActivityLevelCard({ activityLevel }: ActivityLevelCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium">Activity Level</h3>
          <Activity className="h-4 w-4 text-purple-500" />
        </div>
        <p className="text-xs text-muted-foreground mb-2">Weekly progress</p>
        <Progress 
          className="h-2"
          value={activityLevel}
          indicatorClassName="bg-gradient-to-r from-purple-300 to-purple-500"
        />
        <div className="text-xs mt-1 text-right text-muted-foreground">
          {activityLevel}% of your goal
        </div>
      </CardContent>
    </Card>
  );
}
