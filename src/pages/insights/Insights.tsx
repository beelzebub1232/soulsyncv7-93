
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
      const canvas = await html2canvas(insightsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`mindscape_insights_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Report generated",
        description: "Your insights report has been downloaded.",
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
      
      <div className="text-center">
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
