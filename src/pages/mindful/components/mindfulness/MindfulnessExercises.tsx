
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flower, Timer, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MindfulnessExercises() {
  const exercises = [
    {
      title: "Body Scan Meditation",
      duration: "10 min",
      description: "Progressive relaxation through body awareness",
      bgClass: "from-purple-100/50 to-transparent"
    },
    {
      title: "Loving-Kindness",
      duration: "15 min",
      description: "Cultivate compassion and positive emotions",
      bgClass: "from-pink-100/50 to-transparent"
    }
  ];

  return (
    <Card className="overflow-hidden border-mindscape-light/30">
      <CardHeader className="space-y-1 bg-gradient-to-r from-mindscape-light/30 to-transparent">
        <div className="flex items-center gap-2">
          <Flower className="h-5 w-5 text-mindscape-primary" />
          <CardTitle className="text-xl">Mindfulness Practices</CardTitle>
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
                <Timer className="h-4 w-4" />
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
