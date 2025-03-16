
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

interface BreathingControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

export default function BreathingControls({ 
  isPlaying, 
  onPlayPause, 
  onReset 
}: BreathingControlsProps) {
  return (
    <div className="flex gap-2 justify-center mt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
