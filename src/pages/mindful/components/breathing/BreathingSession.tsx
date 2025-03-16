
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BreathingExerciseType } from "../../types";
import BreathingCircle from "./components/BreathingCircle";
import BreathingProgress from "./components/BreathingProgress";
import BreathingControls from "./components/BreathingControls";
import BreathingFeedback from "./components/BreathingFeedback";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

interface BreathingSessionProps {
  exercise: BreathingExerciseType;
  onClose: () => void;
}

export default function BreathingSession({ exercise, onClose }: BreathingSessionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold-in" | "exhale" | "hold-out">("inhale");
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration * 60);
  const [breathCount, setBreathCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [progressLog, setProgressLog] = useLocalStorage<any[]>("mindful-progress-log", []);
  
  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio("/bell-sound.mp3");
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const playBellSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };
  
  // Main timer for the overall session
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            // Log completed exercise
            logCompletedExercise();
            toast({
              title: "Exercise Complete",
              description: `Great job! You've completed ${exercise.name}.`,
            });
            return 0;
          }
          return prev - 1;
        });
        setTotalSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, exercise.name]);
  
  // Breathing phase controller
  useEffect(() => {
    if (!isPlaying) return;
    
    const pattern = exercise.pattern;
    let timeout: number | null = null;
    
    const runBreathingCycle = () => {
      // Inhale
      setCurrentPhase("inhale");
      timeout = window.setTimeout(() => {
        // Hold after inhale
        setCurrentPhase("hold-in");
        timeout = window.setTimeout(() => {
          // Exhale
          setCurrentPhase("exhale");
          timeout = window.setTimeout(() => {
            // Hold after exhale
            setCurrentPhase("hold-out");
            timeout = window.setTimeout(() => {
              // Complete one full breath
              setBreathCount(prev => prev + 1);
              runBreathingCycle();
            }, pattern.holdOut * 1000);
          }, pattern.exhale * 1000);
        }, pattern.holdIn * 1000);
      }, pattern.inhale * 1000);
    };
    
    runBreathingCycle();
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying, exercise.pattern]);
  
  const resetSession = () => {
    setTimeRemaining(exercise.duration * 60);
    setBreathCount(0);
    setTotalSeconds(0);
    setCurrentPhase("inhale");
    setIsPlaying(true);
  };
  
  // Log completed exercise to progress tracker
  const logCompletedExercise = () => {
    if (timeRemaining === 0 || totalSeconds > 30) { // Only log if significant progress was made
      const newLogEntry = {
        id: uuidv4(),
        date: new Date().toISOString(),
        exerciseId: exercise.id,
        exerciseType: "breathing",
        duration: exercise.duration
      };
      
      setProgressLog([...progressLog, newLogEntry]);
      toast({
        title: "Progress Saved",
        description: "Your exercise completion has been recorded.",
      });
    }
  };
  
  // Handle early completion or leaving the exercise
  const handleClose = () => {
    if (totalSeconds > 30 && timeRemaining > 0) {
      // If significant time was spent but not completed, log it anyway
      logCompletedExercise();
    }
    onClose();
  };
  
  return (
    <div className="flex flex-col items-center pb-20 md:pb-12 min-h-[calc(100vh-220px)] justify-between">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-center">{exercise.name}</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full flex flex-col items-center mb-2 space-y-3">
          <AnimatePresence mode="wait">
            <div className="flex flex-col items-center">
              <BreathingCircle
                currentStep={currentPhase}
                circleSize={200}
                exercise={exercise}
              />
              
              <div className="mt-4 mb-2">
                <BreathingFeedback
                  currentStep={currentPhase}
                  remainingTime={timeRemaining}
                  color={exercise.color}
                />
              </div>
            </div>
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Show Details
              </>
            )}
          </Button>
        </div>
        
        {expanded && (
          <div className="w-full max-w-md bg-accent/20 rounded-xl p-3 mb-6">
            <h3 className="text-sm font-medium mb-2">About this exercise:</h3>
            <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
            <div className="flex justify-between text-xs">
              <span>Level: {exercise.level}</span>
              <span>Duration: {exercise.duration} min</span>
            </div>
          </div>
        )}
        
        <div className="w-full max-w-md mb-4">
          <BreathingProgress
            timeRemaining={timeRemaining}
            totalDuration={exercise.duration * 60}
            breathCount={breathCount}
            color={exercise.color}
          />
        </div>
        
        <BreathingControls
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={resetSession}
        />
      </div>
    </div>
  );
}
