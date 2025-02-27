
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

// Define mood types
type MoodValue = "amazing" | "good" | "okay" | "sad" | "awful";

interface Mood {
  value: MoodValue;
  label: string;
  iconUrl: string;
  color: string;
  bgColor: string;
}

// Define mood storage interface
interface MoodEntry {
  value: MoodValue;
  date: Date;
  note?: string;
  userId?: string;
}

const moods: Mood[] = [
  { 
    value: "amazing", 
    label: "Amazing", 
    iconUrl: "/lovable-uploads/0d7b69ba-8f23-4d01-8a52-992492a7859d.png", 
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 border-yellow-300"
  },
  { 
    value: "good", 
    label: "Good", 
    iconUrl: "/lovable-uploads/0d7b69ba-8f23-4d01-8a52-992492a7859d.png", 
    color: "text-pink-500",
    bgColor: "bg-pink-100 border-pink-300" 
  },
  { 
    value: "okay", 
    label: "Okay", 
    iconUrl: "/lovable-uploads/0d7b69ba-8f23-4d01-8a52-992492a7859d.png", 
    color: "text-blue-500",
    bgColor: "bg-blue-100 border-blue-300" 
  },
  { 
    value: "sad", 
    label: "Sad", 
    iconUrl: "/lovable-uploads/0d7b69ba-8f23-4d01-8a52-992492a7859d.png", 
    color: "text-purple-500",
    bgColor: "bg-purple-100 border-purple-300" 
  },
  { 
    value: "awful", 
    label: "Awful", 
    iconUrl: "/lovable-uploads/0d7b69ba-8f23-4d01-8a52-992492a7859d.png", 
    color: "text-gray-500",
    bgColor: "bg-gray-100 border-gray-300" 
  },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const { toast } = useToast();
  const { user } = useUser();
  
  // Function to get today's mood from storage
  const getTodaysMood = async (): Promise<MoodEntry | null> => {
    try {
      // First try to get mood from Supabase if user is logged in
      if (user?.id) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const { data, error } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString())
          .single();
          
        if (data && !error) {
          return {
            value: data.mood as MoodValue,
            date: new Date(data.created_at),
            note: data.note,
            userId: data.user_id
          };
        }
      }
      
      // Fallback to localStorage
      const storedMoods = localStorage.getItem('soulsync_moods');
      if (!storedMoods) return null;
      
      const moods: MoodEntry[] = JSON.parse(storedMoods);
      const today = new Date().toDateString();
      
      return moods.find(mood => new Date(mood.date).toDateString() === today) || null;
    } catch (error) {
      console.error("Error fetching mood:", error);
      return null;
    }
  };
  
  // Function to save mood to storage
  const saveMood = async (mood: MoodValue, note?: string) => {
    const newMoodEntry: MoodEntry = {
      value: mood,
      date: new Date(),
      note: note,
      userId: user?.id
    };
    
    // Try to save to Supabase if user is logged in
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('moods')
          .upsert({
            user_id: user.id,
            mood: mood,
            note: note || null,
            created_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id, created_at::date'
          });
          
        if (error) throw error;
      } catch (error) {
        console.error("Error saving mood to Supabase:", error);
        // Fall back to localStorage if Supabase save fails
      }
    }
    
    // Always save to localStorage as a backup
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
    const fetchTodaysMood = async () => {
      const todaysMood = await getTodaysMood();
      if (todaysMood) {
        setSelectedMood(todaysMood.value);
        setMoodNote(todaysMood.note || "");
      }
    };
    
    fetchTodaysMood();
  }, [user?.id]);
  
  const handleMoodClick = (mood: Mood) => {
    setCurrentMood(mood);
    setMoodDialogOpen(true);
  };
  
  const handleSaveMoodDetails = async () => {
    if (!currentMood) return;
    
    setSelectedMood(currentMood.value);
    await saveMood(currentMood.value, moodNote);
    
    setMoodDialogOpen(false);
    
    toast({
      title: "Mood logged",
      description: `You're feeling ${currentMood.label.toLowerCase()} today.`,
    });
  };
  
  const renderMoodIcon = (index: number) => {
    // This function extracts the correct icon from the sprite based on index
    const iconPositions = ["0px 0px", "-30px 0px", "-60px 0px", "-90px 0px", "-120px 0px"];
    const iconPosition = iconPositions[index];
    
    return (
      <div 
        className="w-8 h-8 bg-contain bg-no-repeat"
        style={{ 
          backgroundImage: `url(${moods[index].iconUrl})`, 
          backgroundPosition: iconPosition
        }}
      />
    );
  };
  
  return (
    <>
      <div className="card-highlight p-5">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">How are you feeling?</h2>
          <p className="text-sm text-muted-foreground">Track your mood daily</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          {moods.map((mood, index) => {
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
                  {renderMoodIcon(index)}
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
                    {moods.findIndex(m => m.value === currentMood.value) !== -1 && 
                      renderMoodIcon(moods.findIndex(m => m.value === currentMood.value))}
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
