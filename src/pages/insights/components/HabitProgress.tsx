
import React from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
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
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
                <Bar 
                  dataKey="percentage" 
                  fill="#9b87f5"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
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
