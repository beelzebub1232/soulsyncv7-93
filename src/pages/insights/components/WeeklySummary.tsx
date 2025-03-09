
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklySummaryProps {
  moodAverage: string;
  journalEntries: number;
  completedHabits: string;
  mindfulnessMinutes: number;
}

export function WeeklySummary({ 
  moodAverage, 
  journalEntries, 
  completedHabits, 
  mindfulnessMinutes 
}: WeeklySummaryProps) {
  
  // Map mood to emoji
  const getMoodEmoji = (mood: string): string => {
    switch(mood.toLowerCase()) {
      case 'amazing': return '😄';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'sad': return '😔';
      case 'awful': return '😞';
      default: return '❓';
    }
  };
  
  // Generate insight based on mood data
  const getInsight = (mood: string): string => {
    switch(mood.toLowerCase()) {
      case 'amazing':
        return 'Your mood has been excellent this week! Keep up with whatever you\'re doing.';
      case 'good':
        return 'Your mood tends to improve on days you complete your morning meditation habit.';
      case 'okay':
        return 'Try increasing your mindfulness minutes to help improve your mood.';
      case 'sad':
        return 'Consider adding more physical activity to your routine to help boost your mood.';
      case 'awful':
        return 'Remember to be kind to yourself during difficult times. Consider reaching out to a friend or professional.';
      default:
        return 'Start tracking your mood regularly to get personalized insights.';
    }
  };
  
  return (
    <Card className="card-highlight">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Mood Average</span>
            <div className="flex items-center">
              <span className="text-lg mr-2">{getMoodEmoji(moodAverage)}</span>
              <span className="font-medium">{moodAverage}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Journal Entries</span>
            <span className="font-medium">{journalEntries}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Completed Habits</span>
            <span className="font-medium">{completedHabits}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Mindfulness Minutes</span>
            <span className="font-medium">{mindfulnessMinutes} mins</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-mindscape-primary/20">
          <h3 className="font-medium mb-2">This Week's Insight</h3>
          <p className="text-sm">
            {getInsight(moodAverage)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
