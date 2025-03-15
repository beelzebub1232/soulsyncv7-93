
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, RotateCcw, Bell, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BreathingExerciseType } from "../../types";
import { Badge } from "@/components/ui/badge";

// Import our components
import BreathingCircle from "./components/BreathingCircle";
import BreathingControls from "./components/BreathingControls";
import BreathingProgress from "./components/BreathingProgress";
import BreathingFeedback from "./components/BreathingFeedback";

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
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const breathingTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Setup audio element for bell sound
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
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            setShowCompletionAnimation(true);
            playBellSound();
            setTimeout(() => {
              setShowCompletionAnimation(false);
              toast({
                title: "Exercise Complete",
                description: `Great job! You've completed ${exercise.name}.`,
              });
            }, 3000);
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
      
      // Play bell sound at the beginning of each breathing cycle
      if (breathCount > 0) {
        playBellSound();
      }
      
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
  }, [isPlaying, exercise.pattern, breathCount]);
  
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
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          {exercise.level}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-6 text-center"
      >
        {exercise.name}
      </motion.h2>
      
      <div className="relative">
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
        
        {/* Completion animation */}
        <AnimatePresence>
          {showCompletionAnimation && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2 }}
              >
                <Heart 
                  className={`h-16 w-16 ${
                    exercise.color === "blue" ? "text-blue-500" : 
                    exercise.color === "purple" ? "text-purple-500" : "text-green-500"
                  }`} 
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center space-y-4 w-full max-w-md mt-8">
        <BreathingProgress
          timeRemaining={timeRemaining}
          totalDuration={exercise.duration * 60}
          breathCount={breathCount}
          color={exercise.color}
        />
        
        <div className="flex justify-center gap-3">
          <BreathingControls 
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onReset={resetSession}
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={playBellSound}
            className="rounded-full"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
