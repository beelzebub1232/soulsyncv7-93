
import { useState, useEffect } from "react";
import { Check, Plus, Calendar, BarChart, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@/contexts/UserContext";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Habit {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  color: string;
  daysCompleted: number;
  totalDays: number;
}

const colorOptions = [
  { label: "Green", value: "bg-mindscape-green border-green-300", textColor: "text-green-800" },
  { label: "Blue", value: "bg-mindscape-blue border-blue-300", textColor: "text-blue-800" },
  { label: "Yellow", value: "bg-mindscape-yellow border-yellow-300", textColor: "text-yellow-800" },
  { label: "Peach", value: "bg-mindscape-peach border-orange-300", textColor: "text-orange-800" },
  { label: "Pink", value: "bg-mindscape-pink border-pink-300", textColor: "text-pink-800" },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitDialogOpen, setNewHabitDialogOpen] = useState(false);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);
  const [statsViewOpen, setStatsViewOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    time: "",
    color: colorOptions[0].value,
  });
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();

  // Load habits from localStorage
  useEffect(() => {
    if (!user) return;
    
    const loadHabits = () => {
      const storageKey = `soulsync_habits_${user.id}`;
      const storedHabits = localStorage.getItem(storageKey);
      
      if (storedHabits) {
        try {
          // Parse the habits from localStorage
          const parsedHabits = JSON.parse(storedHabits);
          
          // Group habits by name to calculate completion stats
          const habitGroups: Record<string, any[]> = {};
          parsedHabits.forEach((habit: any) => {
            if (!habitGroups[habit.name]) {
              habitGroups[habit.name] = [];
            }
            habitGroups[habit.name].push(habit);
          });
          
          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayString = today.toISOString().split('T')[0];
          
          // Convert to the format expected by the UI
          const formattedHabits: Habit[] = Object.entries(habitGroups).map(([name, entries]) => {
            // Find today's entry if it exists
            const todayEntry = entries.find((entry) => {
              const entryDate = new Date(entry.date);
              entryDate.setHours(0, 0, 0, 0);
              return entryDate.toISOString().split('T')[0] === todayString;
            });
            
            // Calculate days completed
            const completedEntries = entries.filter(entry => entry.completed);
            
            // Find a color from existing entries or assign default
            const habitColor = entries.find(entry => entry.color)?.color || getColorForHabit(name);
            
            // Get target days from a random entry (they should all have the same target)
            const targetDays = entries[0]?.targetDays || 7;
            
            return {
              id: todayEntry?.id || `${name}-${Date.now()}`,
              title: name,
              time: todayEntry?.time || "9:00 AM",
              completed: todayEntry?.completed || false,
              color: habitColor,
              daysCompleted: completedEntries.length,
              totalDays: targetDays
            };
          });
          
          setHabits(formattedHabits);
        } catch (error) {
          console.error("Failed to parse habits:", error);
          setHabits([]);
        }
      }
    };
    
    loadHabits();
    
    // Listen for storage events to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `soulsync_habits_${user.id}`) {
        loadHabits();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);
  
  // Helper function to get color based on habit name
  const getColorForHabit = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("meditation") || lowerName.includes("yoga")) {
      return "bg-mindscape-blue border-blue-300";
    } else if (lowerName.includes("exercise") || lowerName.includes("workout")) {
      return "bg-mindscape-green border-green-300";
    } else if (lowerName.includes("read")) {
      return "bg-mindscape-yellow border-yellow-300";
    } else if (lowerName.includes("journal")) {
      return "bg-mindscape-peach border-orange-300";
    } else {
      return "bg-mindscape-pink border-pink-300";
    }
  };
  
  const saveHabitToStorage = (updatedHabits: any[]) => {
    if (!user) return;
    
    const storageKey = `soulsync_habits_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedHabits));
    
    // Dispatch storage event for other components
    const event = new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(updatedHabits),
      storageArea: localStorage
    });
    window.dispatchEvent(event);
  };
  
  const toggleHabit = (id: string) => {
    if (!user) return;
    
    // Update UI state
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const completed = !habit.completed;
        return { 
          ...habit, 
          completed,
          daysCompleted: completed ? habit.daysCompleted + 1 : Math.max(0, habit.daysCompleted - 1)
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    
    // Update localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        const habitToUpdate = allHabits.find((h: any) => h.id === id);
        
        if (habitToUpdate) {
          habitToUpdate.completed = !habitToUpdate.completed;
          saveHabitToStorage(allHabits);
          
          // Show a toast
          const targetHabit = updatedHabits.find(h => h.id === id);
          if (targetHabit) {
            toast({
              title: targetHabit.completed ? "Habit completed!" : "Habit uncompleted",
              description: targetHabit.completed 
                ? `Great job completing your ${targetHabit.title} habit!`
                : `You've marked ${targetHabit.title} as not completed.`,
            });
          }
        }
      } catch (error) {
        console.error("Failed to update habits:", error);
      }
    } else {
      // No habits stored yet, create new entry
      const today = new Date().toISOString();
      const habit = habits.find(h => h.id === id);
      
      if (habit) {
        const newHabitEntry = [{
          id,
          name: habit.title,
          date: today,
          completed: habit.completed,
          targetDays: habit.totalDays,
          time: habit.time,
          color: habit.color
        }];
        
        saveHabitToStorage(newHabitEntry);
      }
    }
  };
  
  const addNewHabit = () => {
    if (!user) return;
    if (!newHabit.title || !newHabit.time) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and time for your habit.",
      });
      return;
    }
    
    const id = Date.now().toString();
    const today = new Date().toISOString();
    
    // Add to UI state
    const habit: Habit = {
      id,
      title: newHabit.title,
      time: newHabit.time,
      completed: false,
      color: newHabit.color,
      daysCompleted: 0,
      totalDays: 7, // Default to weekly goal
    };
    
    setHabits([...habits, habit]);
    
    // Add to localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    const newHabitEntry = {
      id,
      name: newHabit.title,
      date: today,
      completed: false,
      targetDays: 7,
      time: newHabit.time,
      color: newHabit.color
    };
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        saveHabitToStorage([...allHabits, newHabitEntry]);
      } catch (error) {
        console.error("Failed to parse existing habits:", error);
        saveHabitToStorage([newHabitEntry]);
      }
    } else {
      saveHabitToStorage([newHabitEntry]);
    }
    
    setNewHabit({
      title: "",
      time: "",
      color: colorOptions[0].value,
    });
    setNewHabitDialogOpen(false);
    
    toast({
      title: "Habit created",
      description: `You've added "${habit.title}" to your habits.`,
    });
  };
  
  const updateHabit = () => {
    if (!editingHabit || !user) return;
    
    // Update UI state
    setHabits(
      habits.map((habit) => 
        habit.id === editingHabit.id ? editingHabit : habit
      )
    );
    
    // Update in localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits) {
      try {
        const allHabits = JSON.parse(storedHabits);
        
        // Find any entries with this habit name and update them
        const updatedHabits = allHabits.map((habit: any) => {
          if (habit.id === editingHabit.id) {
            return {
              ...habit,
              name: editingHabit.title,
              time: editingHabit.time,
              color: editingHabit.color
            };
          }
          return habit;
        });
        
        saveHabitToStorage(updatedHabits);
      } catch (error) {
        console.error("Failed to update habit:", error);
      }
    }
    
    setEditHabitDialogOpen(false);
    
    toast({
      title: "Habit updated",
      description: `Changes to "${editingHabit.title}" have been saved.`,
    });
  };
  
  const deleteHabit = (id: string) => {
    if (!user) return;
    
    // Get the habit title before removing
    const habitToDelete = habits.find(habit => habit.id === id);
    
    // Update UI state
    setHabits(habits.filter(habit => habit.id !== id));
    
    // Update localStorage
    const storageKey = `soulsync_habits_${user.id}`;
    const storedHabits = localStorage.getItem(storageKey);
    
    if (storedHabits && habitToDelete) {
      try {
        const allHabits = JSON.parse(storedHabits);
        
        // Remove habit with this id and also any entries with the same name
        const updatedHabits = allHabits.filter((habit: any) => 
          habit.id !== id && habit.name !== habitToDelete.title
        );
        
        saveHabitToStorage(updatedHabits);
      } catch (error) {
        console.error("Failed to delete habit:", error);
      }
    }
    
    toast({
      title: "Habit deleted",
      description: habitToDelete 
        ? `"${habitToDelete.title}" has been removed from your habits.`
        : "The habit has been removed from your list.",
    });
  };
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditHabitDialogOpen(true);
  };
  
  const openCalendarView = () => {
    navigate('/insights');
    toast({
      title: "Calendar View",
      description: "Viewing your habits in the Insights section",
    });
  };
  
  const openStatsView = () => {
    navigate('/insights');
    toast({
      title: "Statistics View",
      description: "Viewing your habit statistics in the Insights section",
    });
  };
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Habit Tracker</h1>
          <p className="text-muted-foreground">Build positive routines</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-mindscape-light text-mindscape-primary hover:bg-mindscape-light/80 transition-all"
            aria-label="View calendar"
            onClick={openCalendarView}
          >
            <Calendar className="h-5 w-5" />
          </button>
          
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-mindscape-light text-mindscape-primary hover:bg-mindscape-light/80 transition-all"
            aria-label="View statistics"
            onClick={openStatsView}
          >
            <BarChart className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => setNewHabitDialogOpen(true)}
            className="w-10 h-10 rounded-full bg-mindscape-primary text-white flex items-center justify-center shadow-md hover:bg-mindscape-secondary transition-all"
            aria-label="New habit"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Today's Habits</h2>
        
        {habits.length === 0 ? (
          <div className="card-primary p-5 text-center">
            <p className="text-muted-foreground">No habits added yet.</p>
            <button 
              onClick={() => setNewHabitDialogOpen(true)}
              className="button-primary mt-3"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className={cn(
                  "card-primary p-4 flex items-center transition-all border-l-4",
                  habit.completed ? "border-green-400 bg-green-50" : habit.color
                )}
              >
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center mr-3 transition-colors",
                    habit.completed ? "bg-green-400 border-green-400" : "bg-white border-border"
                  )}
                >
                  {habit.completed && <Check className="h-4 w-4 text-white" />}
                </button>
                
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium transition-all",
                    habit.completed ? "line-through text-muted-foreground" : ""
                  )}>
                    {habit.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{habit.time}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditHabit(habit)}
                    className="p-2 rounded-full hover:bg-mindscape-light/50 transition-colors"
                    aria-label="Edit habit"
                  >
                    <Edit2 className="h-4 w-4 text-mindscape-primary" />
                  </button>
                  
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 rounded-full hover:bg-red-100 transition-colors"
                    aria-label="Delete habit"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {habits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Streaks & Progress</h2>
          
          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="card-primary p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{habit.title}</h3>
                  <span className="text-sm text-mindscape-primary font-medium">
                    {habit.daysCompleted}/{habit.totalDays} days
                  </span>
                </div>
                
                <Progress 
                  value={(habit.daysCompleted / habit.totalDays) * 100} 
                  className="h-2.5"
                  indicatorClassName={habit.color.includes("green") ? "bg-green-500" :
                                    habit.color.includes("blue") ? "bg-blue-500" :
                                    habit.color.includes("yellow") ? "bg-yellow-500" :
                                    habit.color.includes("orange") ? "bg-orange-500" :
                                    "bg-pink-500"}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* New Habit Dialog */}
      <Dialog open={newHabitDialogOpen} onOpenChange={setNewHabitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
            <DialogDescription>
              Add a new habit to track daily
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Habit Name</Label>
              <Input
                id="title"
                placeholder="e.g., Meditation"
                value={newHabit.title}
                onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                placeholder="e.g., 8:00 AM"
                value={newHabit.time}
                onChange={(e) => setNewHabit({...newHabit, time: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <RadioGroup 
                value={newHabit.color}
                onValueChange={(value) => setNewHabit({...newHabit, color: value})}
                className="flex gap-2"
              >
                {colorOptions.map((color) => (
                  <div key={color.value} className="flex items-center">
                    <RadioGroupItem
                      value={color.value}
                      id={`color-${color.label}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`color-${color.label}`}
                      className={cn(
                        "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2",
                        color.value.split(' ')[0],
                        newHabit.color === color.value ? "border-gray-800 ring-2 ring-gray-400" : "border-transparent"
                      )}
                    >
                      {newHabit.color === color.value && <Check className="h-4 w-4 text-white" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewHabitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewHabit} className="button-primary">
              Create Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Habit Dialog */}
      <Dialog open={editHabitDialogOpen} onOpenChange={setEditHabitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Make changes to your habit
            </DialogDescription>
          </DialogHeader>
          
          {editingHabit && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Habit Name</Label>
                <Input
                  id="edit-title"
                  value={editingHabit.title}
                  onChange={(e) => setEditingHabit({...editingHabit, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  value={editingHabit.time}
                  onChange={(e) => setEditingHabit({...editingHabit, time: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Color</Label>
                <RadioGroup 
                  value={editingHabit.color}
                  onValueChange={(value) => setEditingHabit({...editingHabit, color: value})}
                  className="flex gap-2"
                >
                  {colorOptions.map((color) => (
                    <div key={color.value} className="flex items-center">
                      <RadioGroupItem
                        value={color.value}
                        id={`edit-color-${color.label}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`edit-color-${color.label}`}
                        className={cn(
                          "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2",
                          color.value.split(' ')[0],
                          editingHabit.color === color.value ? "border-gray-800 ring-2 ring-gray-400" : "border-transparent"
                        )}
                      >
                        {editingHabit.color === color.value && <Check className="h-4 w-4 text-white" />}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditHabitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateHabit} className="button-primary">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
