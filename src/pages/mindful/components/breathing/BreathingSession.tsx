
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { BreathingExerciseType } from "../../types";

interface BreathingSessionProps {
  exercise: BreathingExerciseType;
  onClose: () => void;
}

export default function BreathingSession({ exercise, onClose }: BreathingSessionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState("inhale");
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration * 60);
  const [breathCount, setBreathCount] = useState(0);
  const [circleSize, setCircleSize] = useState(150);
  const breathingTimerRef = useRef<number | null>(null);
  
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
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, exercise.name]);
  
  useEffect(() => {
    if (!isPlaying) {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
      return;
    }
    
    const breathingCycle = () => {
      // Inhale
      setCurrentStep("inhale");
      setCircleSize(250);
      
      breathingTimerRef.current = window.setTimeout(() => {
        // Hold after inhale
        setCurrentStep("hold-in");
        
        breathingTimerRef.current = window.setTimeout(() => {
          // Exhale
          setCurrentStep("exhale");
          setCircleSize(150);
          
          breathingTimerRef.current = window.setTimeout(() => {
            // Hold after exhale
            setCurrentStep("hold-out");
            
            breathingTimerRef.current = window.setTimeout(() => {
              // Complete one breath cycle
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
  
  const getInstructionText = () => {
    switch (currentStep) {
      case "inhale": return "Breathe In";
      case "hold-in": return "Hold";
      case "exhale": return "Breathe Out";
      case "hold-out": return "Hold";
      default: return "";
    }
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
      
      <h2 className="text-xl font-semibold mb-6 text-center">{exercise.name}</h2>
      
      <div className="relative flex items-center justify-center mb-8">
        <motion.div
          animate={{ width: circleSize, height: circleSize }}
          transition={{ duration: currentStep === "inhale" ? exercise.pattern.inhale : exercise.pattern.exhale, ease: "easeInOut" }}
          className={cn(
            "rounded-full flex items-center justify-center",
            exercise.color === "blue" && "bg-blue-100/50",
            exercise.color === "purple" && "bg-purple-100/50",
            exercise.color === "green" && "bg-green-100/50"
          )}
        >
          <motion.div
            animate={{ 
              width: circleSize * 0.7, 
              height: circleSize * 0.7 
            }}
            transition={{ duration: currentStep === "inhale" ? exercise.pattern.inhale : exercise.pattern.exhale, ease: "easeInOut" }}
            className={cn(
              "rounded-full flex items-center justify-center",
              exercise.color === "blue" && "bg-blue-200/50",
              exercise.color === "purple" && "bg-purple-200/50",
              exercise.color === "green" && "bg-green-200/50"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xl font-medium"
              >
                {getInstructionText()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="text-center space-y-4 w-full max-w-md">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Time Remaining: {formatTime(timeRemaining)}</span>
          <span>Breath Cycles: {breathCount}</span>
        </div>
        
        <Progress 
          value={(timeRemaining / (exercise.duration * 60)) * 100} 
          className="h-2" 
          indicatorClassName={cn(
            exercise.color === "blue" && "bg-blue-500",
            exercise.color === "purple" && "bg-purple-500",
            exercise.color === "green" && "bg-green-500"
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
