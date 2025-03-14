
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock } from "lucide-react";

export function ProgressTracking() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-mindscape-primary" />
          <CardTitle>Your Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-mindscape-primary" />
              <span className="text-sm font-medium">Weekly Goal</span>
            </div>
            <span className="text-sm text-muted-foreground">4/7 days</span>
          </div>
          <Progress value={57} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-mindscape-primary" />
            <span className="text-sm font-medium">Total Practice Time</span>
          </div>
          <span className="text-sm font-medium">45 minutes</span>
        </div>
      </CardContent>
    </Card>
  );
}
