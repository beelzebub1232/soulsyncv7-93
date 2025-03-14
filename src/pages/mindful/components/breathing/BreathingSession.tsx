
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pause, Play } from "lucide-react";
import { BreathingExerciseType } from "../../types";
import BreathingCircle from "./components/BreathingCircle";
import BreathingProgress from "./components/BreathingProgress";
import BreathingControls from "./components/BreathingControls";
import BreathingFeedback from "./components/BreathingFeedback";
import { toast } from "sonner";

interface BreathingSessionProps {
  exercise: BreathingExerciseType;
  onClose: () => void;
  onComplete?: () => void;
}

export default function BreathingSession({ exercise, onClose, onComplete }: BreathingSessionProps) {
  const [timeLeft, setTimeLeft] = useState(exercise.duration * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold-in" | "exhale" | "hold-out">("inhale");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(exercise.pattern.inhale);
  const [completed, setCompleted] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  const animationRef = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  
  const totalSeconds = exercise.duration * 60;
  const progress = 100 - (timeLeft / totalSeconds) * 100;
  
  // Handle breathing animation and time updates
  const animate = (time: number) => {
    if (lastTime.current === null) {
      lastTime.current = time;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    const deltaTime = time - lastTime.current;
    
    if (deltaTime >= 1000) { // Update every second
      // Update total time
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Session complete
          setIsPlaying(false);
          setCompleted(true);
          toast.success("Breathing session completed!");
          return 0;
        }
        return prev - 1;
      });
      
      // Update phase time
      setPhaseTimeLeft(prev => {
        if (prev <= 1) {
          // Phase complete, move to next phase
          switch (currentPhase) {
            case "inhale":
              setCurrentPhase("hold-in");
              return exercise.pattern.holdIn;
            case "hold-in":
              setCurrentPhase("exhale");
              return exercise.pattern.exhale;
            case "exhale":
              setCurrentPhase("hold-out");
              return exercise.pattern.holdOut;
            case "hold-out":
              setCurrentPhase("inhale");
              setCycles(prev => prev + 1);
              return exercise.pattern.inhale;
          }
        }
        return prev - 1;
      });
      
      lastTime.current = time;
    }
    
    if (isPlaying && !completed) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  useEffect(() => {
    if (isPlaying && !completed) {
      lastTime.current = null;
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, completed]);
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      onClose();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      
      <BreathingProgress 
        progress={progress} 
        timeLeft={formatTime(timeLeft)}
        cycles={cycles}
      />
      
      <div className="flex flex-col items-center justify-center py-4">
        <BreathingCircle 
          phase={currentPhase}
          pattern={exercise.pattern}
          isPlaying={isPlaying}
        />
        
        <BreathingFeedback 
          phase={currentPhase} 
          timeLeft={phaseTimeLeft}
        />
        
        <BreathingControls 
          isPlaying={isPlaying} 
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      </div>
      
      <div className="mt-4 p-4 bg-background/80 rounded-xl border border-border/50">
        <h3 className="text-sm font-medium mb-2">Breathing Pattern</h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="flex justify-between">
            <span>Inhale</span>
            <span className="font-medium">{exercise.pattern.inhale}s</span>
          </div>
          <div className="flex justify-between">
            <span>Hold</span>
            <span className="font-medium">{exercise.pattern.holdIn}s</span>
          </div>
          <div className="flex justify-between">
            <span>Exhale</span>
            <span className="font-medium">{exercise.pattern.exhale}s</span>
          </div>
          <div className="flex justify-between">
            <span>Hold</span>
            <span className="font-medium">{exercise.pattern.holdOut}s</span>
          </div>
        </div>
      </div>
      
      {completed && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl p-6 max-w-md w-full border border-border shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-center">Session Complete!</h2>
            <p className="text-center text-muted-foreground mb-6">
              You've completed the {exercise.name} breathing session. Great job!
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
