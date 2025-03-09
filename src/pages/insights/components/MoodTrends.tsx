
import React from 'react';
import { LineChart as LineChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface MoodTrendsProps {
  weeklyMoodCounts: Record<string, number>;
  moodTrend: number;
}

export function MoodTrends({ weeklyMoodCounts, moodTrend }: MoodTrendsProps) {
  // Convert data to format expected by recharts
  const chartData = Object.entries(weeklyMoodCounts).map(([day, count]) => ({
    day,
    count
  }));
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-mindscape-primary" />
            Mood Trends
          </CardTitle>
          <div className={`text-sm font-medium flex items-center gap-1 ${moodTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {moodTrend >= 0 ? '+' : ''}{moodTrend}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#9b87f5" 
                strokeWidth={2}
                dot={{ r: 4, fill: "#9b87f5", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#6952c9", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
