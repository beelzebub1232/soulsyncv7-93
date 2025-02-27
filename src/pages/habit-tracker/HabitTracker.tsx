
import { useState } from "react";
import { Check, Plus, Calendar, BarChart, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

// Sample habits for demonstration
const sampleHabits: Habit[] = [
  {
    id: "1",
    title: "Meditation",
    time: "8:00 AM",
    completed: false,
    color: "bg-mindscape-green border-green-300",
    daysCompleted: 18,
    totalDays: 21,
  },
  {
    id: "2",
    title: "Journaling",
    time: "9:30 AM",
    completed: true,
    color: "bg-mindscape-blue border-blue-300",
    daysCompleted: 7,
    totalDays: 7,
  },
  {
    id: "3",
    title: "Take a walk",
    time: "6:00 PM",
    completed: false,
    color: "bg-mindscape-peach border-orange-300",
    daysCompleted: 12,
    totalDays: 14,
  },
  {
    id: "4",
    title: "Read a book",
    time: "9:00 PM",
    completed: false,
    color: "bg-mindscape-pink border-pink-300",
    daysCompleted: 5,
    totalDays: 10,
  },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(sampleHabits);
  const [newHabitDialogOpen, setNewHabitDialogOpen] = useState(false);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    title: "",
    time: "",
    color: colorOptions[0].value,
  });
  const { toast } = useToast();
  
  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const completed = !habit.completed;
          return { 
            ...habit, 
            completed,
            daysCompleted: completed ? habit.daysCompleted + 1 : habit.daysCompleted
          };
        }
        return habit;
      })
    );
  };
  
  const addNewHabit = () => {
    if (!newHabit.title || !newHabit.time) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and time for your habit.",
      });
      return;
    }
    
    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit.title,
      time: newHabit.time,
      completed: false,
      color: newHabit.color,
      daysCompleted: 0,
      totalDays: 0,
    };
    
    setHabits([...habits, habit]);
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
    if (!editingHabit) return;
    
    setHabits(
      habits.map((habit) => 
        habit.id === editingHabit.id ? editingHabit : habit
      )
    );
    
    setEditHabitDialogOpen(false);
    
    toast({
      title: "Habit updated",
      description: `Changes to "${editingHabit.title}" have been saved.`,
    });
  };
  
  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
    
    toast({
      title: "Habit deleted",
      description: "The habit has been removed from your list.",
    });
  };
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditHabitDialogOpen(true);
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
          >
            <Calendar className="h-5 w-5" />
          </button>
          
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-mindscape-light text-mindscape-primary hover:bg-mindscape-light/80 transition-all"
            aria-label="View statistics"
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
              
              <div className="w-full bg-mindscape-light rounded-full h-2.5">
                <div 
                  className="bg-mindscape-primary h-2.5 rounded-full"
                  style={{ width: `${(habit.daysCompleted / habit.totalDays) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
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
