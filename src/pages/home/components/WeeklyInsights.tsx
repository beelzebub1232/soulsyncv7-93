
import { ArrowUp, ArrowDown, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WeeklyInsights() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Mood Trend</h3>
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <ArrowUp className="h-3 w-3" />
              <span>12%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Your mood has been improving</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-300 to-green-500 w-3/4 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Journal Consistency</h3>
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <ArrowDown className="h-3 w-3" />
              <span>8%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Try to journal more regularly</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-300 to-red-400 w-1/2 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Habit Streaks</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-end gap-1 mt-2">
            <div className="bg-blue-100 h-4 w-2 rounded-t"></div>
            <div className="bg-blue-200 h-6 w-2 rounded-t"></div>
            <div className="bg-blue-300 h-8 w-2 rounded-t"></div>
            <div className="bg-blue-400 h-10 w-2 rounded-t"></div>
            <div className="bg-blue-500 h-12 w-2 rounded-t"></div>
            <div className="bg-blue-600 h-8 w-2 rounded-t"></div>
            <div className="bg-blue-400 h-10 w-2 rounded-t"></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Activity Level</h3>
            <Activity className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground mb-1">Weekly progress</p>
          <div className="flex items-center gap-1 text-lg font-medium">
            <span className="text-purple-600">68%</span>
            <span className="text-xs text-muted-foreground">of your goal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
