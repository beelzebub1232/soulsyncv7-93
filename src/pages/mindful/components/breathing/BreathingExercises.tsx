
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Wind, Clock, Timer, Play, Heart, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import BreathingSession from "./BreathingSession";
import { breathingExercises } from "../../data/breathingExercises";
import { Badge } from "@/components/ui/badge";

export default function BreathingExercises() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const toggleFavorite = (id: string) => {
    if (favoriteExercises.includes(id)) {
      setFavoriteExercises(favoriteExercises.filter(exerciseId => exerciseId !== id));
    } else {
      setFavoriteExercises([...favoriteExercises, id]);
    }
  };

  const filters = [
    { label: "All", value: null },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Favorites", value: "favorites" }
  ];

  const filteredExercises = breathingExercises.filter(exercise => {
    if (activeFilter === "favorites") {
      return favoriteExercises.includes(exercise.id);
    } else if (activeFilter) {
      return exercise.level === activeFilter;
    }
    return true;
  });

  if (activeSession) {
    const exercise = breathingExercises.find(ex => ex.id === activeSession);
    if (!exercise) return null;
    
    return (
      <BreathingSession 
        exercise={exercise} 
        onClose={() => setActiveSession(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <Wind className="h-5 w-5 text-mindscape-primary" />
          Breathing Exercises
        </h2>
        <span className="text-sm text-muted-foreground">Choose an exercise to begin</span>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(filter => (
          <Badge 
            key={filter.label}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1 rounded-full",
              activeFilter === filter.value && "bg-mindscape-primary hover:bg-mindscape-primary/90"
            )}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
      
      <ScrollArea className="h-[calc(100vh-280px)]">
        {filteredExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Wind className="h-10 w-10 mb-2 opacity-50" />
            <p>No exercises match your filter</p>
            <button 
              className="text-mindscape-primary underline mt-2"
              onClick={() => setActiveFilter(null)}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredExercises.map((exercise) => (
              <Card 
                key={exercise.id}
                className={cn(
                  "overflow-hidden transition-all hover:shadow-md",
                  exercise.color === "blue" && "bg-gradient-to-br from-blue-50 to-transparent border-blue-200/50",
                  exercise.color === "purple" && "bg-gradient-to-br from-purple-50 to-transparent border-purple-200/50",
                  exercise.color === "green" && "bg-gradient-to-br from-green-50 to-transparent border-green-200/50"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{exercise.name}</CardTitle>
                    <button 
                      onClick={() => toggleFavorite(exercise.id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Heart className={cn(
                        "h-5 w-5",
                        favoriteExercises.includes(exercise.id) ? "fill-red-400 text-red-400" : "fill-transparent"
                      )} />
                    </button>
                  </div>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{exercise.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4" />
                      <span>{exercise.level}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button 
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "w-full flex items-center justify-center gap-2",
                      exercise.color === "blue" && "bg-blue-500 hover:bg-blue-600",
                      exercise.color === "purple" && "bg-purple-500 hover:bg-purple-600",
                      exercise.color === "green" && "bg-green-500 hover:bg-green-600"
                    )}
                    onClick={() => setActiveSession(exercise.id)}
                  >
                    <Play className="h-4 w-4" />
                    Start Exercise
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
