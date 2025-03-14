
import React from "react";
import { Clock, Heart, Play, ScanFace } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MindfulnessExerciseType } from "../../../types";

interface ExerciseCardProps {
  exercise: MindfulnessExerciseType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onStartSession: (id: string) => void;
}

export default function ExerciseCard({ 
  exercise, 
  isFavorite, 
  onToggleFavorite,
  onStartSession 
}: ExerciseCardProps) {
  return (
    <Card 
      key={exercise.id}
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        exercise.color === "blue" && "bg-gradient-to-br from-blue-50 to-transparent border-blue-200/50",
        exercise.color === "purple" && "bg-gradient-to-br from-purple-50 to-transparent border-purple-200/50",
        exercise.color === "green" && "bg-gradient-to-br from-green-50 to-transparent border-green-200/50",
        exercise.color === "orange" && "bg-gradient-to-br from-orange-50 to-transparent border-orange-200/50"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{exercise.name}</CardTitle>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(exercise.id);
            }}
            className="text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Heart className={cn(
              "h-5 w-5",
              isFavorite ? "fill-red-400 text-red-400" : "fill-transparent"
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
            <ScanFace className="h-4 w-4" />
            <span>{exercise.focus}</span>
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
            exercise.color === "green" && "bg-green-500 hover:bg-green-600",
            exercise.color === "orange" && "bg-orange-500 hover:bg-orange-600"
          )}
          onClick={() => onStartSession(exercise.id)}
        >
          <Play className="h-4 w-4" />
          Start Exercise
        </button>
      </CardFooter>
    </Card>
  );
}
