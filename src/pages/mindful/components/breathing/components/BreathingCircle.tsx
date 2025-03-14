
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

  return (
    <div className="relative flex items-center justify-center mb-8">
      <motion.div
        animate={{ width: circleSize, height: circleSize }}
        transition={{ 
          duration: currentStep === "inhale" ? exercise.pattern.inhale : exercise.pattern.exhale, 
          ease: "easeInOut" 
        }}
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
          transition={{ 
            duration: currentStep === "inhale" ? exercise.pattern.inhale : exercise.pattern.exhale, 
            ease: "easeInOut" 
          }}
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
              className="text-xl font-medium text-center"
            >
              {getInstructionText()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
