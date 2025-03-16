
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onBell?: () => void;
  color?: string;
}

export default function BreathingControls({ 
  isPlaying, 
  onPlayPause, 
  onReset,
  onBell,
  color
}: BreathingControlsProps) {
  return (
    <div className="flex gap-2 justify-center mt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        className={cn(
          color === "blue" && "border-blue-200 text-blue-700 hover:bg-blue-50",
          color === "purple" && "border-purple-200 text-purple-700 hover:bg-purple-50",
          color === "green" && "border-green-200 text-green-700 hover:bg-green-50"
        )}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className={cn(
          color === "blue" && "border-blue-200 text-blue-700 hover:bg-blue-50",
          color === "purple" && "border-purple-200 text-purple-700 hover:bg-purple-50",
          color === "green" && "border-green-200 text-green-700 hover:bg-green-50"
        )}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      {onBell && (
        <Button
          variant="outline"
          size="icon"
          onClick={onBell}
          className={cn(
            color === "blue" && "border-blue-200 text-blue-700 hover:bg-blue-50",
            color === "purple" && "border-purple-200 text-purple-700 hover:bg-purple-50",
            color === "green" && "border-green-200 text-green-700 hover:bg-green-50"
          )}
        >
          <Bell className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
