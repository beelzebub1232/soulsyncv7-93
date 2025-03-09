
import React from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export function HabitProgress() {
  // This would normally come from habit tracking data
  // For now, let's provide sample data
  const habitData = [
    { name: 'Meditation', completed: 5, total: 7 },
    { name: 'Exercise', completed: 4, total: 7 },
    { name: 'Journaling', completed: 6, total: 7 },
    { name: 'Reading', completed: 3, total: 7 },
    { name: 'Water', completed: 7, total: 7 }
  ];
  
  // Calculate completion percentage
  const chartData = habitData.map(habit => ({
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
      </CardContent>
    </Card>
  );
}
