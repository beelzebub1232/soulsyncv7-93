
import React from 'react';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { CalendarDay } from './CalendarDay';
import { weekDays, getMonthDays } from './calendarUtils';

interface CalendarGridProps {
  currentDate: Date;
  moods: MoodEntry[];
}

export function CalendarGrid({ currentDate, moods }: CalendarGridProps) {
  const days = getMonthDays(currentDate);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Create empty cells for the first row before the first day of the month
  const emptyCells = Array(firstDayOfMonth).fill(null);
  
  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before the first day of the month */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}
        
        {/* Current month days */}
        {days.map((day, index) => (
          <CalendarDay 
            key={`current-${index}`} 
            day={day} 
            moods={moods} 
          />
        ))}
      </div>
    </>
  );
}
