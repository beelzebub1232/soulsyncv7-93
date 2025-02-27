
import { BarChart, Calendar, LineChart, PieChart } from "lucide-react";

export default function Insights() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-display">Insights</h1>
        <p className="text-muted-foreground">Track your progress and patterns</p>
      </header>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="card-primary p-4 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
            <Calendar className="h-5 w-5 text-mindscape-primary" />
          </div>
          <h3 className="font-medium text-center">Mood Calendar</h3>
        </div>
        
        <div className="card-primary p-4 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
            <LineChart className="h-5 w-5 text-mindscape-primary" />
          </div>
          <h3 className="font-medium text-center">Mood Trends</h3>
        </div>
        
        <div className="card-primary p-4 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
            <PieChart className="h-5 w-5 text-mindscape-primary" />
          </div>
          <h3 className="font-medium text-center">Emotion Analysis</h3>
        </div>
        
        <div className="card-primary p-4 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-mindscape-light flex items-center justify-center mb-2">
            <BarChart className="h-5 w-5 text-mindscape-primary" />
          </div>
          <h3 className="font-medium text-center">Habit Progress</h3>
        </div>
      </div>
      
      <div className="card-highlight p-5">
        <h2 className="text-lg font-semibold mb-3">Weekly Summary</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Mood Average</span>
            <div className="flex items-center">
              <span className="text-lg mr-2">🙂</span>
              <span className="font-medium">Good</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Journal Entries</span>
            <span className="font-medium">5</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Completed Habits</span>
            <span className="font-medium">12/15</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Mindfulness Minutes</span>
            <span className="font-medium">45 mins</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-mindscape-primary/20">
          <h3 className="font-medium mb-2">This Week's Insight</h3>
          <p className="text-sm">
            Your mood tends to improve on days you complete your morning meditation habit. Keep it up!
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <button className="button-secondary">
          View Detailed Reports
        </button>
      </div>
    </div>
  );
}
