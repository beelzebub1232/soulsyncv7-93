import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Sun, 
  Smile, 
  Meh, 
  Frown, 
  Cloud,
  X 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Define mood types
type MoodValue = "amazing" | "good" | "okay" | "sad" | "awful";

interface Mood {
  value: MoodValue;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// Define mood storage interface
interface MoodEntry {
  value: MoodValue;
  date: Date;
  note?: string;
}

const moods: Mood[] = [
  { 
    value: "amazing", 
    label: "Amazing", 
    icon: <Sun className="h-8 w-8 stroke-[1.5]" />, 
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200"
  },
  { 
    value: "good", 
    label: "Good", 
    icon: <Smile className="h-8 w-8 stroke-[1.5]" />, 
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200" 
  },
  { 
    value: "okay", 
    label: "Okay", 
    icon: <Meh className="h-8 w-8 stroke-[1.5]" />, 
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200" 
  },
  { 
    value: "sad", 
    label: "Sad", 
    icon: <Frown className="h-8 w-8 stroke-[1.5]" />, 
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200" 
  },
  { 
    value: "awful", 
    label: "Awful", 
    icon: <Cloud className="h-8 w-8 stroke-[1.5]" />, 
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200" 
  },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const { toast } = useToast();
  
  // Function to get today's mood from storage
  const getTodaysMood = (): MoodEntry | null => {
    const storedMoods = localStorage.getItem('soulsync_moods');
    if (!storedMoods) return null;
    
    const moods: MoodEntry[] = JSON.parse(storedMoods);
    const today = new Date().toDateString();
    
    return moods.find(mood => new Date(mood.date).toDateString() === today) || null;
  };
  
  // Function to save mood to storage
  const saveMood = (mood: MoodValue, note?: string) => {
    const newMoodEntry: MoodEntry = {
      value: mood,
      date: new Date(),
      note: note
    };
    
    const storedMoods = localStorage.getItem('soulsync_moods');
    const moods: MoodEntry[] = storedMoods ? JSON.parse(storedMoods) : [];
    
    // Check if there's already an entry for today
    const todayIndex = moods.findIndex(
      mood => new Date(mood.date).toDateString() === new Date().toDateString()
    );
    
    if (todayIndex >= 0) {
      // Update today's entry
      moods[todayIndex] = newMoodEntry;
    } else {
      // Add new entry
      moods.push(newMoodEntry);
    }
    
    localStorage.setItem('soulsync_moods', JSON.stringify(moods));
  };
  
  // Load today's mood when component mounts
  useEffect(() => {
    const todaysMood = getTodaysMood();
    if (todaysMood) {
      setSelectedMood(todaysMood.value);
      setMoodNote(todaysMood.note || "");
    }
  }, []);
  
  const handleMoodClick = (mood: Mood) => {
    setCurrentMood(mood);
    setMoodDialogOpen(true);
  };
  
  const handleSaveMoodDetails = () => {
    if (!currentMood) return;
    
    setSelectedMood(currentMood.value);
    saveMood(currentMood.value, moodNote);
    
    setMoodDialogOpen(false);
    
    toast({
      title: "Mood logged",
      description: `You're feeling ${currentMood.label.toLowerCase()} today.`,
    });
  };
  
  return (
    <>
      <div className="card-highlight p-5">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">How are you feeling?</h2>
          <p className="text-sm text-muted-foreground">Track your mood daily</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.value;
            
            return (
              <button
                key={mood.value}
                onClick={() => handleMoodClick(mood)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:scale-110",
                  isSelected ? 
                    `${mood.bgColor} border-2 scale-110` : 
                    "border border-transparent"
                )}
              >
                <div className={cn("transition-colors", mood.color, isSelected ? "animate-bounce-soft" : "")}>
                  {mood.icon}
                </div>
                <span className="text-xs mt-1 font-medium">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Mood Details Dialog */}
      <Dialog open={moodDialogOpen} onOpenChange={setMoodDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Add more details about your mood
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentMood && (
              <div className="flex flex-col items-center justify-center mb-4">
                <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", currentMood.bgColor)}>
                  <div className={currentMood.color}>
                    {currentMood.icon}
                  </div>
                </div>
                <h3 className="text-lg font-medium mt-2">{currentMood.label}</h3>
              </div>
            )}
            
            <Textarea
              placeholder="What's making you feel this way? (optional)"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <Button variant="ghost" onClick={() => setMoodDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveMoodDetails}
              className="button-primary"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
