
import React from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface HabitProgressProps {
  habitProgress: {
    name: string;
    completed: number;
    total: number;
  }[];
}

export function HabitProgress({ habitProgress = [] }: HabitProgressProps) {
  // Calculate completion percentage
  const chartData = habitProgress.map(habit => ({
    name: habit.name,
    percentage: Math.round((habit.completed / habit.total) * 100)
  }));

  // Colors based on percentage
  const getBarColor = (percent: number) => {
    if (percent >= 75) return '#22c55e'; // green-500
    if (percent >= 50) return '#3b82f6'; // blue-500
    if (percent >= 25) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-mindscape-primary" />
          Habit Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  width={80}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Completion']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  cursor={{ fill: 'rgba(155, 135, 245, 0.1)' }}
                />
                <Bar 
                  dataKey="percentage" 
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No habit data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
