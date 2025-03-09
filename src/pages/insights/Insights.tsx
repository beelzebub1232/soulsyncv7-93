
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useInsightsData } from './hooks/useInsightsData';
import { MoodCalendar } from './components/MoodCalendar';
import { MoodTrends } from './components/MoodTrends';
import { EmotionAnalysis } from './components/EmotionAnalysis';
import { HabitProgress } from './components/HabitProgress';
import { WeeklySummary } from './components/WeeklySummary';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Insights() {
  const { data, isLoading, selectedDate, setSelectedDate } = useInsightsData();
  const insightsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Function to generate and download PDF report
  const downloadReport = async () => {
    if (!insightsRef.current || !data) {
      toast({
        title: "Cannot generate report",
        description: "No data available to generate report.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Generating report",
      description: "Please wait while we prepare your report...",
    });
    
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title to the PDF
      pdf.setFontSize(20);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Mindscape Insights Report', 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 20, 30);
      
      // Add a line separator
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 35, 190, 35);
      
      // Add weekly summary section
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Weekly Summary', 20, 45);
      
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Mood Average: ${data.weeklySummary.moodAverage}`, 25, 55);
      pdf.text(`Journal Entries: ${data.weeklySummary.journalEntries}`, 25, 62);
      pdf.text(`Completed Habits: ${data.weeklySummary.completedHabits}`, 25, 69);
      pdf.text(`Mindfulness Minutes: ${data.weeklySummary.mindfulnessMinutes}`, 25, 76);
      
      // Add mood distribution section
      pdf.setFontSize(16);
      pdf.text('Mood Distribution', 20, 90);
      
      let y = 100;
      Object.entries(data.moodDistribution).forEach(([mood, count], index) => {
        pdf.setFontSize(12);
        pdf.text(`${mood}: ${count} entries`, 25, y);
        y += 7;
      });
      
      // Add habit progress section
      pdf.setFontSize(16);
      pdf.text('Habit Progress', 20, y + 10);
      
      y += 20;
      data.habitProgress.forEach((habit) => {
        const percentage = Math.round((habit.completed / habit.total) * 100);
        pdf.setFontSize(12);
        pdf.text(`${habit.name}: ${habit.completed}/${habit.total} days (${percentage}%)`, 25, y);
        y += 7;
      });
      
      // Add weekly mood counts
      pdf.setFontSize(16);
      pdf.text('Weekly Mood Entries', 20, y + 10);
      
      y += 20;
      Object.entries(data.weeklyMoodCounts).forEach(([day, count]) => {
        pdf.setFontSize(12);
        pdf.text(`${day}: ${count} entries`, 25, y);
        y += 7;
      });
      
      // Add insights section
      pdf.setFontSize(16);
      pdf.text('Insights', 20, y + 10);
      
      // Generate insight text based on mood data
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
      
      const insightText = getInsight(data.weeklySummary.moodAverage);
      pdf.setFontSize(12);
      
      // Split long text into multiple lines
      const splitText = pdf.splitTextToSize(insightText, 160);
      pdf.text(splitText, 25, y + 20);
      
      // Save the PDF
      pdf.save(`mindscape_insights_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Report generated",
        description: "Your detailed insights report has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating report",
        description: "There was a problem creating your PDF report.",
        variant: "destructive"
      });
    }
  };

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
      
      <div ref={insightsRef} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {data ? (
            <>
              <MoodCalendar moods={data.recentMoods} />
              <MoodTrends 
                weeklyMoodCounts={data.weeklyMoodCounts} 
                moodTrend={data.moodTrend} 
              />
              <EmotionAnalysis moodDistribution={data.moodDistribution} />
              <HabitProgress habitProgress={data.habitProgress} />
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
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="button-secondary flex items-center gap-2"
          onClick={downloadReport}
          disabled={!data}
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
