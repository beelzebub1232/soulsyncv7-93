
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock } from "lucide-react";

export function ProgressTracking() {
  return (
    <Card className="overflow-hidden border-mindscape-light/30">
      <CardHeader className="space-y-1 bg-gradient-to-br from-amber-100/50 via-mindscape-light/30 to-transparent">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-mindscape-primary" />
          <CardTitle className="text-xl">Your Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-mindscape-primary" />
              <span className="text-sm font-medium">Weekly Goal</span>
            </div>
            <span className="text-sm text-muted-foreground">4/7 days</span>
          </div>
          <Progress value={57} className="h-2 bg-mindscape-light" indicatorClassName="bg-mindscape-primary" />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-mindscape-light/30 to-transparent rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-mindscape-primary" />
            <span className="text-sm font-medium">Total Practice Time</span>
          </div>
          <span className="text-sm font-medium text-mindscape-tertiary">45 minutes</span>
        </div>
      </CardContent>
    </Card>
  );
}
