import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BreathingExerciseType } from "../../types";

// Import our new components
import BreathingCircle from "./components/BreathingCircle";
import BreathingControls from "./components/BreathingControls";
import BreathingProgress from "./components/BreathingProgress";
import BreathingFeedback from "./components/BreathingFeedback";

interface BreathingSessionProps {
  exercise: BreathingExerciseType;
  onClose: () => void;
  onComplete?: (exerciseId: string, durationMinutes: number) => void;
}

export default function BreathingSession({ exercise, onClose, onComplete }: BreathingSessionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState("inhale");
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration * 60);
  const [breathCount, setBreathCount] = useState(0);
  const [circleSize, setCircleSize] = useState(150);
  const breathingTimerRef = useRef<number | null>(null);
  
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
    if (!isPlaying) {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
      return;
    }
    
    const breathingCycle = () => {
      setCurrentStep("inhale");
      setCircleSize(250);
      
      breathingTimerRef.current = window.setTimeout(() => {
        setCurrentStep("hold-in");
        
        breathingTimerRef.current = window.setTimeout(() => {
          setCurrentStep("exhale");
          setCircleSize(150);
          
          breathingTimerRef.current = window.setTimeout(() => {
            setCurrentStep("hold-out");
            
            breathingTimerRef.current = window.setTimeout(() => {
              setBreathCount(prev => prev + 1);
              breathingCycle();
            }, exercise.pattern.holdOut * 1000);
          }, exercise.pattern.exhale * 1000);
        }, exercise.pattern.holdIn * 1000);
      }, exercise.pattern.inhale * 1000);
    };
    
    breathingCycle();
    
    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
    };
  }, [isPlaying, exercise.pattern]);
  
  const resetSession = () => {
    setTimeRemaining(exercise.duration * 60);
    setBreathCount(0);
    setCurrentStep("inhale");
    setCircleSize(150);
    setIsPlaying(true);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-0 right-0"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
      
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-6 text-center"
      >
        {exercise.name}
      </motion.h2>
      
      <BreathingCircle 
        currentStep={currentStep}
        circleSize={circleSize}
        exercise={exercise}
      />
      
      <BreathingFeedback 
        currentStep={currentStep} 
        remainingTime={timeRemaining}
        color={exercise.color}
      />
      
      <div className="text-center space-y-4 w-full max-w-md">
        <BreathingProgress
          timeRemaining={timeRemaining}
          totalDuration={exercise.duration * 60}
          breathCount={breathCount}
          color={exercise.color}
        />
        
        <BreathingControls 
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onReset={resetSession}
        />
      </div>
    </div>
  );
}
