
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, RotateCcw, Bell, Heart, Info, Settings, Volume2, Volume1, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BreathingExerciseType } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState("inhale");
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration * 60);
  const [breathCount, setBreathCount] = useState(0);
  const [circleSize, setCircleSize] = useState(150);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  const [volume, setVolume] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  
  const breathingTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Statistics
  const [avgBreathDuration, setAvgBreathDuration] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const lastBreathTimeRef = useRef<number>(Date.now());
  
  useEffect(() => {
    // Setup audio element for bell sound
    audioRef.current = new Audio("/bell-sound.mp3");
    audioRef.current.volume = volume / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update audio volume when volume slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  const playBellSound = useCallback(() => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [soundEnabled]);
  
  // Timer for session duration
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            setShowCompletionAnimation(true);
            playBellSound();
            
            // Save session stats to local storage
            const sessionData = {
              exerciseId: exercise.id,
              date: new Date().toISOString(),
              duration: exercise.duration * 60,
              breathCount,
              caloriesBurned: Math.round(caloriesBurned)
            };
            
            const existingSessions = JSON.parse(localStorage.getItem('breathing-sessions') || '[]');
            localStorage.setItem('breathing-sessions', JSON.stringify([...existingSessions, sessionData]));
            
            setTimeout(() => {
              setShowCompletionAnimation(false);
              toast({
                title: "Exercise Complete",
                description: `Great job! You've completed ${exercise.name} with ${breathCount} breaths.`,
              });
            }, 3000);
            return 0;
          }
          return prev - 1;
        });
        
        // Update calories burned (very rough estimate)
        // Approximately 1-2 calories per minute for relaxed breathing
        setCaloriesBurned(prev => prev + (1.5 / 60));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, exercise.name, exercise.duration, breathCount, playBellSound, caloriesBurned]);
  
  // Breathing cycle animation
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
      
      // Calculate breath duration for statistics
      const now = Date.now();
      const breathDuration = (now - lastBreathTimeRef.current) / 1000;
      
      // Only update after first breath
      if (breathCount > 0 && breathDuration < 30) { // Prevent outliers if paused for long
        setAvgBreathDuration(prev => {
          const newAvg = ((prev * (breathCount - 1)) + breathDuration) / breathCount;
          return newAvg;
        });
      }
      
      lastBreathTimeRef.current = now;
      
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
  }, [isPlaying, exercise.pattern, breathCount, playBellSound]);
  
  const resetSession = () => {
    setTimeRemaining(exercise.duration * 60);
    setBreathCount(0);
    setCurrentStep("inhale");
    setCircleSize(150);
    setIsPlaying(true);
    setAvgBreathDuration(0);
    setCaloriesBurned(0);
    lastBreathTimeRef.current = Date.now();
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  // Describe the exercise pattern in text
  const getPatternDescription = () => {
    return `Inhale for ${exercise.pattern.inhale} seconds, hold for ${exercise.pattern.holdIn} seconds, exhale for ${exercise.pattern.exhale} seconds, then rest for ${exercise.pattern.holdOut} seconds before repeating.`;
  };
  
  // Render benefits based on exercise type
  const renderBenefits = () => {
    const commonBenefits = [
      "Reduces stress and anxiety",
      "Improves focus and concentration",
      "Helps lower blood pressure",
      "Promotes better sleep quality"
    ];
    
    const specificBenefits: {[key: string]: string[]} = {
      "box-breathing": [
        "Used by Navy SEALs for stress management",
        "Creates mental clarity in high-pressure situations",
        "Balances oxygen and CO2 levels"
      ],
      "4-7-8-breathing": [
        "Acts as a natural tranquilizer for the nervous system",
        "Particularly effective for falling asleep",
        "Can help reduce anger responses"
      ],
      "deep-breathing": [
        "Activates the parasympathetic nervous system",
        "Increases oxygen supply to the brain",
        "Strengthens diaphragm muscles"
      ]
    };
    
    const benefits = [...(specificBenefits[exercise.id] || []), ...commonBenefits];
    
    return (
      <ul className="space-y-2 mt-4">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className={cn(
              "rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5",
              exercise.color === "blue" && "bg-blue-100 text-blue-600",
              exercise.color === "purple" && "bg-purple-100 text-purple-600",
              exercise.color === "green" && "bg-green-100 text-green-600"
            )}>
              ✓
            </div>
            <span className="text-sm">{benefit}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="flex flex-col items-center h-full max-h-[calc(100vh-160px)] overflow-auto">
      {/* Header with fixed position */}
      <div className="w-full sticky top-0 bg-background z-10 flex items-center justify-between mb-4 p-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {exercise.level}
          </Badge>
          <h2 className="text-lg md:text-xl font-semibold">{exercise.name}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main content with tabs */}
      <div className="w-full flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-2">
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="statistics">Stats</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <div className="overflow-auto h-full">
            <TabsContent value="practice" className="mt-0 h-full relative">
              <div className="flex flex-col items-center">
                {/* Breathing circle with contained dimensions */}
                <div className="w-full relative mb-4">
                  <BreathingCircle 
                    currentStep={currentStep}
                    circleSize={circleSize}
                    exercise={exercise}
                  />
                  
                  {/* Feedback overlay */}
                  {showGuide && (
                    <BreathingFeedback 
                      currentStep={currentStep} 
                      remainingTime={timeRemaining}
                      color={exercise.color}
                    />
                  )}
                  
                  {/* Completion animation */}
                  <AnimatePresence>
                    {showCompletionAnimation && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full z-20"
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
                            className={cn(
                              "h-16 w-16",
                              exercise.color === "blue" ? "text-blue-500" : 
                              exercise.color === "purple" ? "text-purple-500" : "text-green-500"
                            )} 
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Progress and controls in a fixed container */}
                <div className="text-center w-full max-w-md px-4">
                  <BreathingProgress
                    timeRemaining={timeRemaining}
                    totalDuration={exercise.duration * 60}
                    breathCount={breathCount}
                    color={exercise.color}
                  />
                  
                  <div className="flex justify-center gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlayPause}
                      className={cn(
                        "rounded-full",
                        !isPlaying && exercise.color === "blue" && "border-blue-500 text-blue-500",
                        !isPlaying && exercise.color === "purple" && "border-purple-500 text-purple-500",
                        !isPlaying && exercise.color === "green" && "border-green-500 text-green-500"
                      )}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetSession}
                      className="rounded-full"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={playBellSound}
                      className="rounded-full"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleSound}
                            className="rounded-full"
                          >
                            {soundEnabled ? 
                              (volume > 50 ? <Volume2 className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />) : 
                              <VolumeX className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{soundEnabled ? "Mute sounds" : "Enable sounds"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowGuide(!showGuide)}
                            className={cn(
                              "rounded-full",
                              showGuide && "bg-background-foreground/5"
                            )}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{showGuide ? "Hide guidance" : "Show guidance"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {/* Sound volume control */}
                  {soundEnabled && (
                    <div className="flex items-center gap-4 mt-4 px-4">
                      <Volume1 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={(vals) => setVolume(vals[0])}
                        className={cn(
                          exercise.color === "blue" && "text-blue-500",
                          exercise.color === "purple" && "text-purple-500",
                          exercise.color === "green" && "text-green-500"
                        )}
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-0 px-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Breath Count</CardTitle>
                    <CardDescription>Total breaths in this session</CardDescription>
                    <div className={cn(
                      "text-3xl font-bold mt-2",
                      exercise.color === "blue" && "text-blue-600",
                      exercise.color === "purple" && "text-purple-600",
                      exercise.color === "green" && "text-green-600"
                    )}>
                      {breathCount}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Time Elapsed</CardTitle>
                    <CardDescription>Session duration</CardDescription>
                    <div className={cn(
                      "text-3xl font-bold mt-2",
                      exercise.color === "blue" && "text-blue-600",
                      exercise.color === "purple" && "text-purple-600",
                      exercise.color === "green" && "text-green-600"
                    )}>
                      {Math.floor((exercise.duration * 60 - timeRemaining) / 60)}:{((exercise.duration * 60 - timeRemaining) % 60).toString().padStart(2, '0')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Avg Breath Cycle</CardTitle>
                    <CardDescription>Average seconds per breath</CardDescription>
                    <div className={cn(
                      "text-3xl font-bold mt-2",
                      exercise.color === "blue" && "text-blue-600",
                      exercise.color === "purple" && "text-purple-600",
                      exercise.color === "green" && "text-green-600"
                    )}>
                      {avgBreathDuration.toFixed(1)}s
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Calories</CardTitle>
                    <CardDescription>Estimated calories burned</CardDescription>
                    <div className={cn(
                      "text-3xl font-bold mt-2",
                      exercise.color === "blue" && "text-blue-600",
                      exercise.color === "purple" && "text-purple-600",
                      exercise.color === "green" && "text-green-600"
                    )}>
                      {Math.round(caloriesBurned)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1">Efficiency</CardTitle>
                      <CardDescription>How well you're following the pattern</CardDescription>
                    </div>
                    <div className={cn(
                      "text-sm font-medium px-2 py-1 rounded",
                      breathCount >= 10 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700" 
                    )}>
                      {breathCount >= 10 ? "Excellent" : breathCount >= 5 ? "Good" : "Learning"}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Breathing rhythm</span>
                      <span className="font-medium">{getPatternDescription()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Consistency</span>
                      <span className="font-medium">{breathCount > 3 ? Math.min(100, Math.round(100 - (Math.abs(avgBreathDuration - (exercise.pattern.inhale + exercise.pattern.holdIn + exercise.pattern.exhale + exercise.pattern.holdOut)) * 5))) : 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="info" className="mt-0 px-4">
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="text-xl mb-2">{exercise.name}</CardTitle>
                  <CardDescription className="text-base">{exercise.description}</CardDescription>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">How to practice</h3>
                    <p className="text-sm text-muted-foreground">{getPatternDescription()}</p>
                    
                    <h3 className="font-medium mt-4 mb-2">Benefits</h3>
                    {renderBenefits()}
                    
                    <h3 className="font-medium mt-4 mb-2">Tips</h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-muted-foreground">Find a comfortable seated position</li>
                      <li className="text-sm text-muted-foreground">Keep your back straight but not rigid</li>
                      <li className="text-sm text-muted-foreground">Try to breathe from your diaphragm, not your chest</li>
                      <li className="text-sm text-muted-foreground">If your mind wanders, gently bring it back to your breath</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
