
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HollowHeartIcon } from "@/components/icons/HeartIcon";

interface MoodCalendarProps {
  moodData: any[];
  onBack: () => void;
}

export function MoodCalendar({ moodData, onBack }: MoodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Fill in leading empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-border/20 rounded-md opacity-50"></div>);
    }
    
    // Fill in days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find mood for this day
      const dayMood = moodData.find(mood => {
        const moodDate = new Date(mood.date || mood.created_at);
        return moodDate.getFullYear() === year && 
               moodDate.getMonth() === month && 
               moodDate.getDate() === i;
      });
      
      const moodColors: Record<string, string> = {
        "amazing": "bg-green-100 border-green-300 text-green-800",
        "good": "bg-blue-100 border-blue-300 text-blue-800",
        "okay": "bg-yellow-100 border-yellow-300 text-yellow-800",
        "sad": "bg-orange-100 border-orange-300 text-orange-800",
        "awful": "bg-red-100 border-red-300 text-red-800"
      };
      
      const moodEmojis: Record<string, string> = {
        "amazing": "😄",
        "good": "🙂",
        "okay": "😐",
        "sad": "🙁",
        "awful": "😢"
      };
      
      const moodValue = dayMood?.value || dayMood?.mood;
      const moodColor = moodValue ? moodColors[moodValue] : "bg-background border-border/50";
      const moodEmoji = moodValue ? moodEmojis[moodValue] : "";
      
      days.push(
        <div 
          key={i} 
          className={`h-12 border rounded-md flex flex-col justify-between p-1 ${moodColor}`}
        >
          <div className="text-xs font-medium">{i}</div>
          {dayMood && (
            <div className="text-sm flex justify-center">{moodEmoji}</div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <CardTitle className="ml-2">Mood Calendar</CardTitle>
        </div>
        <CardDescription>Track your mood patterns over time</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          
          <h3 className="font-medium">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <Button variant="outline" size="sm" onClick={nextMonth}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          <div className="text-xs font-medium">Sun</div>
          <div className="text-xs font-medium">Mon</div>
          <div className="text-xs font-medium">Tue</div>
          <div className="text-xs font-medium">Wed</div>
          <div className="text-xs font-medium">Thu</div>
          <div className="text-xs font-medium">Fri</div>
          <div className="text-xs font-medium">Sat</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </CardContent>
      
      <CardFooter className="flex-col items-start space-y-2 border-t pt-6">
        <h4 className="font-medium text-sm">Legend</h4>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300"></div>
            <span className="text-xs">Amazing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300"></div>
            <span className="text-xs">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-300"></div>
            <span className="text-xs">Okay</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-orange-100 border border-orange-300"></div>
            <span className="text-xs">Sad</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300"></div>
            <span className="text-xs">Awful</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
