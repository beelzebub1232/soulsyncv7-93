
import React from 'react';
import { Button } from '@/components/ui/button';
import { useInsightsData } from './hooks/useInsightsData';
import { MoodCalendar } from './components/MoodCalendar';
import { MoodTrends } from './components/MoodTrends';
import { EmotionAnalysis } from './components/EmotionAnalysis';
import { HabitProgress } from './components/HabitProgress';
import { WeeklySummary } from './components/WeeklySummary';
import { Skeleton } from '@/components/ui/skeleton';

export default function Insights() {
  const { data, isLoading } = useInsightsData();
  
  // Loading states
  if (isLoading) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold font-display">Insights</h1>
          <p className="text-muted-foreground">Track your progress and patterns</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-[270px] w-full" />
          ))}
        </div>
        
        <Skeleton className="h-[340px] w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-display">Insights</h1>
        <p className="text-muted-foreground">Track your progress and patterns</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-4">
        {data ? (
          <>
            <MoodCalendar moods={data.recentMoods} />
            <MoodTrends 
              weeklyMoodCounts={data.weeklyMoodCounts} 
              moodTrend={data.moodTrend} 
            />
            <EmotionAnalysis moodDistribution={data.moodDistribution} />
            <HabitProgress />
          </>
        ) : (
          <div className="md:col-span-2 p-6 text-center">
            <p className="text-muted-foreground">No data available. Start tracking your mood to see insights.</p>
          </div>
        )}
      </div>
      
      {data && (
        <WeeklySummary 
          moodAverage={data.weeklySummary.moodAverage}
          journalEntries={data.weeklySummary.journalEntries}
          completedHabits={data.weeklySummary.completedHabits}
          mindfulnessMinutes={data.weeklySummary.mindfulnessMinutes}
        />
      )}
      
      <div className="text-center">
        <Button variant="outline" className="button-secondary">
          Download Reports
        </Button>
      </div>
    </div>
  );
}
