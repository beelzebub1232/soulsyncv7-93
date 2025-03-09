
import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';

interface EmotionAnalysisProps {
  moodDistribution: Record<string, number>;
}

export function EmotionAnalysis({ moodDistribution }: EmotionAnalysisProps) {
  const COLORS = {
    'amazing': '#4ade80', // green-400
    'good': '#86efac',   // green-300
    'okay': '#93c5fd',   // blue-300
    'sad': '#fdba74',    // orange-300
    'awful': '#fca5a5',  // red-300
  };
  
  const MOOD_LABELS = {
    'amazing': 'Amazing',
    'good': 'Good',
    'okay': 'Okay',
    'sad': 'Sad',
    'awful': 'Awful',
  };
  
  // Convert data to format expected by recharts
  const chartData = Object.entries(moodDistribution).map(([mood, count]) => ({
    name: MOOD_LABELS[mood as keyof typeof MOOD_LABELS] || mood,
    value: count,
    color: COLORS[mood as keyof typeof COLORS] || '#d4d4d4'
  }));
  
  // Calculate total entries
  const totalEntries = chartData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-mindscape-primary" />
          Emotion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalEntries > 0 ? (
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No mood data recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
