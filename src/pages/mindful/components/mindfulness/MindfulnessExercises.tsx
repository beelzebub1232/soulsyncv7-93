
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lotus, Timer, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MindfulnessExercises() {
  const exercises = [
    {
      title: "Body Scan Meditation",
      duration: "10 min",
      description: "Progressive relaxation through body awareness"
    },
    {
      title: "Loving-Kindness",
      duration: "15 min",
      description: "Cultivate compassion and positive emotions"
    }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Lotus className="h-5 w-5 text-mindscape-primary" />
          <CardTitle>Mindfulness Practices</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
            <div className="space-y-1">
              <h3 className="font-medium">{exercise.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
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
