
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { format, isSameDay } from 'date-fns';

interface MoodCalendarProps {
  moods: MoodEntry[];
}

export function MoodCalendar({ moods }: MoodCalendarProps) {
  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate weeks for the current month (simplified)
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (30 - i));
    return day;
  });
  
  // Function to get mood for a specific day
  const getMoodForDay = (day: Date): MoodEntry | undefined => {
    return moods.find(mood => isSameDay(new Date(mood.date), day));
  };
  
  // Function to get color class based on mood
  const getMoodColorClass = (mood?: MoodEntry): string => {
    if (!mood) return 'bg-gray-100';
    
    switch(mood.value) {
      case 'amazing': return 'bg-green-400';
      case 'good': return 'bg-green-300';
      case 'okay': return 'bg-blue-300';
      case 'sad': return 'bg-orange-300';
      case 'awful': return 'bg-red-300';
      default: return 'bg-gray-100';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-mindscape-primary" />
            Mood Calendar
          </CardTitle>
          <span className="text-sm text-muted-foreground">{format(today, 'MMMM yyyy')}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const mood = getMoodForDay(day);
            const colorClass = getMoodColorClass(mood);
            const isToday = isSameDay(day, today);
            
            return (
              <div 
                key={index}
                className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium
                  ${colorClass} ${isToday ? 'ring-2 ring-mindscape-primary' : ''}`}
                title={mood ? `${format(day, 'PP')}: ${mood.value}` : format(day, 'PP')}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
