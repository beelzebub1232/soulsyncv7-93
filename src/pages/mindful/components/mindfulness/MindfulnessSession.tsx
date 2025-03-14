
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pause, Play, SkipForward } from "lucide-react";
import { MindfulnessExerciseType, MindfulnessStep } from "../../types";
import { toast } from "sonner";

interface MindfulnessSessionProps {
  exercise: MindfulnessExerciseType;
  onClose: () => void;
  onComplete?: () => void;
}

export default function MindfulnessSession({ exercise, onClose, onComplete }: MindfulnessSessionProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercise.steps[0]?.duration || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const totalDuration = exercise.steps.reduce((sum, step) => sum + step.duration, 0);
  const elapsedDuration = exercise.steps
    .slice(0, currentStepIndex)
    .reduce((sum, step) => sum + step.duration, 0) + (exercise.steps[currentStepIndex]?.duration - timeLeft);
  
  const progress = (elapsedDuration / totalDuration) * 100;
  const currentStep = exercise.steps[currentStepIndex];
  
  // Timer for current step
  useEffect(() => {
    let timerId: number | null = null;
    
    if (isPlaying && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentStepIndex < exercise.steps.length - 1) {
      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
      setTimeLeft(exercise.steps[currentStepIndex + 1]?.duration || 0);
    } else if (timeLeft === 0 && currentStepIndex === exercise.steps.length - 1 && !sessionCompleted) {
      // Session completed
      setIsPlaying(false);
      setSessionCompleted(true);
      toast.success("Mindfulness session completed!");
      if (onComplete) {
        onComplete();
      }
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isPlaying, timeLeft, currentStepIndex, exercise.steps, sessionCompleted, onComplete]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSkip = () => {
    if (currentStepIndex < exercise.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setTimeLeft(exercise.steps[currentStepIndex + 1]?.duration || 0);
    } else {
      // Complete session if skipping last step
      setTimeLeft(0);
      setIsPlaying(false);
      setSessionCompleted(true);
      toast.success("Mindfulness session completed!");
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      onClose();
    }
  };
  
  return (
    <div className="h-full space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={onClose}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-lg font-semibold">{exercise.name}</h2>
      </div>
      
      <div className="bg-gradient-to-br from-mindscape-light/40 to-transparent rounded-xl p-4 border border-mindscape-primary/20">
        <div className="flex justify-between text-sm mb-1 text-mindscape-tertiary">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium mb-1">{currentStep?.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{currentStep?.instruction}</p>
          
          <div className="text-4xl font-bold text-mindscape-primary mb-6">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-mindscape-primary/30"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-mindscape-primary/30"
              onClick={handleSkip}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-medium">Session Steps</h3>
        {exercise.steps.map((step, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${
              index === currentStepIndex 
                ? 'bg-mindscape-light/30 border-mindscape-primary/30' 
                : index < currentStepIndex 
                  ? 'bg-background/50 border-border/30 opacity-70' 
                  : 'bg-background/50 border-border/30'
            }`}
          >
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">{step.title}</h4>
              <span className="text-xs text-muted-foreground">{formatTime(step.duration)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{step.instruction}</p>
          </div>
        ))}
      </div>
      
      {sessionCompleted && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl p-6 max-w-md w-full border border-border shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-center">Session Complete!</h2>
            <p className="text-center text-muted-foreground mb-6">
              You've completed the {exercise.name} session. Take a moment to notice how you feel.
            </p>
            <Button 
              className="w-full bg-mindscape-primary hover:bg-mindscape-primary/90"
              onClick={handleComplete}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
