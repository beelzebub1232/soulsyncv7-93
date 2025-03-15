import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { MindfulnessExerciseType } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MindfulnessSessionProps {
  exercise: MindfulnessExerciseType;
  onClose: () => void;
  onComplete?: (exerciseId: string, durationMinutes: number) => void;
}

export default function MindfulnessSession({ exercise, onClose, onComplete }: MindfulnessSessionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration * 60);
  const stepTimerRef = useRef<number | null>(null);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            toast({
              title: "Exercise Complete",
              description: `Great job! You've completed ${exercise.name}.`,
            });
            if (onComplete) {
              onComplete(exercise.id, exercise.duration);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, exercise.name, exercise.id, exercise.duration, onComplete]);
  
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
      return;
    }
    
    const currentStep = exercise.steps[currentStepIndex];
    
    stepTimerRef.current = window.setTimeout(() => {
      // Move to next step
      if (currentStepIndex < exercise.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Last step - loop back to beginning if there's still time
        if (timeRemaining > 10) {
          setCurrentStepIndex(0);
        }
      }
    }, currentStep.duration * 1000);
    
    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, [currentStepIndex, isPlaying, exercise.steps, timeRemaining]);
  
  const resetSession = () => {
    setTimeRemaining(exercise.duration * 60);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };
  
  const currentStep = exercise.steps[currentStepIndex];
  
  return (
    <div className="flex flex-col items-center justify-start h-[60vh] relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-0 right-0"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
      
      <h2 className="text-xl font-semibold mb-4 text-center">{exercise.name}</h2>
      
      <div className={cn(
        "relative flex items-center justify-center mb-6 w-full max-w-md p-6 rounded-xl",
        exercise.color === "blue" && "bg-blue-100/20",
        exercise.color === "purple" && "bg-purple-100/20",
        exercise.color === "green" && "bg-green-100/20",
        exercise.color === "orange" && "bg-orange-100/20"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-lg font-medium mb-2">{currentStep.title}</h3>
            <ScrollArea className="h-[180px]">
              <p className="text-muted-foreground">{currentStep.instruction}</p>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="text-center space-y-4 w-full max-w-md">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Time Remaining: {formatTime(timeRemaining)}</span>
          <span>Step {currentStepIndex + 1} of {exercise.steps.length}</span>
        </div>
        
        <Progress 
          value={(timeRemaining / (exercise.duration * 60)) * 100} 
          className="h-2" 
          indicatorClassName={cn(
            exercise.color === "blue" && "bg-blue-500",
            exercise.color === "purple" && "bg-purple-500",
            exercise.color === "green" && "bg-green-500",
            exercise.color === "orange" && "bg-orange-500"
          )}
        />
        
        <div className="flex gap-2 justify-center mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={resetSession}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
