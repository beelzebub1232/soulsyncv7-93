
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BreathingExercises() {
  const exercises = [
    {
      title: "Box Breathing",
      duration: "5 min",
      description: "Equal duration inhale, hold, exhale, and hold pattern"
    },
    {
      title: "4-7-8 Breathing",
      duration: "8 min",
      description: "Inhale for 4, hold for 7, exhale for 8 counts"
    }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-mindscape-primary" />
          <CardTitle>Breathing Exercises</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
            <div className="space-y-1">
              <h3 className="font-medium">{exercise.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{exercise.duration}</span>
              </div>
              <p className="text-sm text-muted-foreground">{exercise.description}</p>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0">
              <PlayCircle className="h-6 w-6" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
