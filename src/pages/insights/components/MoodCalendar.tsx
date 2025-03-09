
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  getDay,
  isSameMonth
} from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

interface MoodCalendarProps {
  moods: MoodEntry[];
}

export function MoodCalendar({ moods }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate all days in the current month
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get days before the first of the month to fill up the first row
  const firstDayOfMonth = getDay(monthStart);
  const prevMonthDays = firstDayOfMonth > 0 
    ? eachDayOfInterval({ 
        start: subMonths(monthStart, 1), 
        end: subMonths(monthStart, 1) 
      }).slice(-firstDayOfMonth)
    : [];
  
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
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Handle year change
  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  };
  
  // Handle month change
  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(month));
    setCurrentDate(newDate);
  };
  
  // Generate years for dropdown (10 years before and after current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  // Generate months for dropdown
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" }
  ];
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-mindscape-primary" />
            Mood Calendar
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={currentDate.getMonth().toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[120px] h-8 text-sm">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[90px] h-8 text-sm">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{format(currentDate, 'MMMM yyyy')}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Previous month days */}
          {prevMonthDays.map((day, index) => {
            const mood = getMoodForDay(day);
            const colorClass = getMoodColorClass(mood);
            
            return (
              <div 
                key={`prev-${index}`}
                className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium
                  ${colorClass} opacity-40`}
                title={mood ? `${format(day, 'PP')}: ${mood.value}` : format(day, 'PP')}
              >
                {day.getDate()}
              </div>
            );
          })}
          
          {/* Current month days */}
          {days.map((day, index) => {
            const mood = getMoodForDay(day);
            const colorClass = getMoodColorClass(mood);
            const isToday = isSameDay(day, new Date());
            
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
          
          {/* Fill remaining grid spaces with next month's days */}
          {Array.from({ length: (7 - ((prevMonthDays.length + days.length) % 7)) % 7 }).map((_, index) => {
            const nextMonthDay = new Date(days[days.length - 1]);
            nextMonthDay.setDate(nextMonthDay.getDate() + index + 1);
            const mood = getMoodForDay(nextMonthDay);
            const colorClass = getMoodColorClass(mood);
            
            return (
              <div 
                key={`next-${index}`}
                className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium
                  ${colorClass} opacity-40`}
                title={mood ? `${format(nextMonthDay, 'PP')}: ${mood.value}` : format(nextMonthDay, 'PP')}
              >
                {nextMonthDay.getDate()}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs">Amazing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-300"></div>
            <span className="text-xs">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-300"></div>
            <span className="text-xs">Okay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-300"></div>
            <span className="text-xs">Sad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-300"></div>
            <span className="text-xs">Awful</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
