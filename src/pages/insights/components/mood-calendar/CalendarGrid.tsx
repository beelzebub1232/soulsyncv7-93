
import React from 'react';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { CalendarDay } from './CalendarDay';
import { weekDays, getMonthDays, getPreviousMonthDays, getNextMonthDays } from './calendarUtils';

interface CalendarGridProps {
  currentDate: Date;
  moods: MoodEntry[];
}

export function CalendarGrid({ currentDate, moods }: CalendarGridProps) {
  const days = getMonthDays(currentDate);
  const prevMonthDays = getPreviousMonthDays(currentDate);
  const nextMonthDays = getNextMonthDays([...prevMonthDays, ...days]);

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
        {/* Previous month days */}
        {prevMonthDays.map((day, index) => (
          <CalendarDay 
            key={`prev-${index}`} 
            day={day} 
            moods={moods} 
            isCurrentMonth={false} 
          />
        ))}
        
        {/* Current month days */}
        {days.map((day, index) => (
          <CalendarDay 
            key={`current-${index}`} 
            day={day} 
            moods={moods} 
          />
        ))}
        
        {/* Next month days */}
        {nextMonthDays.map((day, index) => (
          <CalendarDay 
            key={`next-${index}`} 
            day={day} 
            moods={moods} 
            isCurrentMonth={false} 
          />
        ))}
      </div>
    </>
  );
}
