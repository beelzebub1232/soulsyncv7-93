
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

interface BreathingCircleProps {
  currentStep: string;
  circleSize: number;
  exercise: {
    color: string;
    pattern: {
      inhale: number;
      exhale: number;
      holdIn: number;
      holdOut: number;
    };
  };
}

export default function BreathingCircle({ currentStep, circleSize, exercise }: BreathingCircleProps) {
  const getInstructionText = () => {
    switch (currentStep) {
      case "inhale": return "Breathe In";
      case "hold-in": return "Hold";
      case "exhale": return "Breathe Out";
      case "hold-out": return "Hold";
      default: return "";
    }
  };

  // Get the current duration for the animation based on step
  const getCurrentDuration = () => {
    switch (currentStep) {
      case "inhale": return exercise.pattern.inhale;
      case "hold-in": return exercise.pattern.holdIn;
      case "exhale": return exercise.pattern.exhale;
      case "hold-out": return exercise.pattern.holdOut;
      default: return 4;
    }
  };

  // Add count-down animation
  const countdownValue = () => {
    const duration = getCurrentDuration();
    if (duration <= 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold"
      >
        {duration}s
      </motion.div>
    );
  };

  return (
    <div className="relative flex items-center justify-center mb-8">
      <motion.div
        animate={{ 
          width: circleSize, 
          height: circleSize,
          borderColor: currentStep === "inhale" || currentStep === "hold-in" 
            ? "rgba(0, 0, 255, 0.3)" 
            : "rgba(0, 0, 255, 0.1)"
        }}
        transition={{ 
          duration: currentStep === "inhale" 
            ? exercise.pattern.inhale 
            : currentStep === "exhale" 
              ? exercise.pattern.exhale 
              : 0.5, 
          ease: "easeInOut" 
        }}
        className={cn(
          "rounded-full flex items-center justify-center border-4",
          exercise.color === "blue" && "bg-blue-100/50 border-blue-200",
          exercise.color === "purple" && "bg-purple-100/50 border-purple-200",
          exercise.color === "green" && "bg-green-100/50 border-green-200"
        )}
      >
        <motion.div
          animate={{ 
            width: circleSize * 0.7, 
            height: circleSize * 0.7,
            opacity: currentStep === "hold-in" || currentStep === "hold-out" ? [0.7, 1, 0.7] : 1
          }}
          transition={{ 
            duration: currentStep === "inhale" 
              ? exercise.pattern.inhale 
              : currentStep === "exhale" 
                ? exercise.pattern.exhale 
                : 2,
            repeat: (currentStep === "hold-in" || currentStep === "hold-out") ? Infinity : 0,
            ease: "easeInOut" 
          }}
          className={cn(
            "rounded-full flex items-center justify-center relative",
            exercise.color === "blue" && "bg-blue-200/50",
            exercise.color === "purple" && "bg-purple-200/50",
            exercise.color === "green" && "bg-green-200/50"
          )}
        >
          {countdownValue()}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "text-xl font-medium text-center",
                exercise.color === "blue" && "text-blue-700",
                exercise.color === "purple" && "text-purple-700",
                exercise.color === "green" && "text-green-700"
              )}
            >
              {getInstructionText()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
      
      {/* Add pulsing rings for visual effect */}
      {currentStep === "inhale" && (
        <motion.div
          className={cn(
            "absolute rounded-full border-2 z-0",
            exercise.color === "blue" && "border-blue-300/40",
            exercise.color === "purple" && "border-purple-300/40",
            exercise.color === "green" && "border-green-300/40"
          )}
          initial={{ width: circleSize * 0.9, height: circleSize * 0.9, opacity: 0 }}
          animate={{ 
            width: [circleSize * 0.9, circleSize * 1.1, circleSize * 1.3],
            height: [circleSize * 0.9, circleSize * 1.1, circleSize * 1.3],
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      {currentStep === "exhale" && (
        <motion.div
          className={cn(
            "absolute rounded-full border-2 z-0",
            exercise.color === "blue" && "border-blue-300/40",
            exercise.color === "purple" && "border-purple-300/40",
            exercise.color === "green" && "border-green-300/40"
          )}
          initial={{ width: circleSize * 1.3, height: circleSize * 1.3, opacity: 0 }}
          animate={{ 
            width: [circleSize * 1.3, circleSize * 1.1, circleSize * 0.9],
            height: [circleSize * 1.3, circleSize * 1.1, circleSize * 0.9],
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </div>
  );
}
