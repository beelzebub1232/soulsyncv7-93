
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BreathingProgressProps {
  timeRemaining: number;
  totalDuration: number;
  breathCount: number;
  color: string;
}

export default function BreathingProgress({ 
  timeRemaining, 
  totalDuration,
  breathCount,
  color 
}: BreathingProgressProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Time Remaining: {formatTime(timeRemaining)}</span>
        <span>Breath Cycles: {breathCount}</span>
      </div>
      
      <Progress 
        value={(timeRemaining / totalDuration) * 100} 
        className="h-2" 
        indicatorClassName={cn(
          color === "blue" && "bg-blue-500",
          color === "purple" && "bg-purple-500",
          color === "green" && "bg-green-500"
        )}
      />
    </div>
  );
}
