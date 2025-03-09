
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

  // Custom label renderer to place text outside the chart
  const renderCustomizedLabel = ({
    cx, cy, midAngle, outerRadius, percent, index, name
  }: any) => {
    // Don't render label if percentage is too small
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="#888888"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-mindscape-primary" />
          Emotion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalEntries > 0 ? (
          <div className="h-[210px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} entries`, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
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
