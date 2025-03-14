
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingFeedbackProps {
  currentStep: string;
  remainingTime: number;
  color: string;
}

export default function BreathingFeedback({ 
  currentStep, 
  remainingTime,
  color 
}: BreathingFeedbackProps) {
  // Visual indicator based on current breathing step
  const renderIcon = () => {
    switch (currentStep) {
      case "inhale":
        return (
          <motion.div
            initial={{ y: 10 }}
            animate={{ y: -10 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className={cn(
              "p-2 rounded-full",
              color === "blue" && "text-blue-600",
              color === "purple" && "text-purple-600",
              color === "green" && "text-green-600"
            )}
          >
            <ArrowUp className="h-6 w-6" />
          </motion.div>
        );
      case "exhale":
        return (
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 10 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className={cn(
              "p-2 rounded-full",
              color === "blue" && "text-blue-600",
              color === "purple" && "text-purple-600",
              color === "green" && "text-green-600"
            )}
          >
            <ArrowDown className="h-6 w-6" />
          </motion.div>
        );
      case "hold-in":
      case "hold-out":
        return (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={cn(
              "p-2 rounded-full",
              color === "blue" && "text-blue-600",
              color === "purple" && "text-purple-600",
              color === "green" && "text-green-600"
            )}
          >
            <Clock className="h-6 w-6" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
      {renderIcon()}
    </div>
  );
}
