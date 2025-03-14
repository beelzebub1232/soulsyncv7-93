
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BreathingExercises() {
  const exercises = [
    {
      title: "Box Breathing",
      duration: "5 min",
      description: "Equal duration inhale, hold, exhale, and hold pattern",
      bgClass: "from-blue-100/50 to-transparent"
    },
    {
      title: "4-7-8 Breathing",
      duration: "8 min",
      description: "Inhale for 4, hold for 7, exhale for 8 counts",
      bgClass: "from-indigo-100/50 to-transparent"
    }
  ];

  return (
    <Card className="overflow-hidden border-mindscape-light/30">
      <CardHeader className="space-y-1 bg-gradient-to-r from-mindscape-light/30 to-transparent">
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-mindscape-primary" />
          <CardTitle className="text-xl">Breathing Exercises</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {exercises.map((exercise, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md",
              "bg-gradient-to-r",
              exercise.bgClass
            )}
          >
            <div className="space-y-1.5">
              <h3 className="font-medium text-mindscape-tertiary">{exercise.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{exercise.duration}</span>
              </div>
              <p className="text-sm text-muted-foreground">{exercise.description}</p>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0 hover:bg-white/50">
              <PlayCircle className="h-6 w-6 text-mindscape-primary" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
