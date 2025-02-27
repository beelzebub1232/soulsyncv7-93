
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HabitProgressProps {
  habitData: any[];
  onBack: () => void;
}

export function HabitProgress({ habitData, onBack }: HabitProgressProps) {
  // Process data for charts
  const habitCompletionData = habitData.map(habit => ({
    name: habit.title,
    completed: habit.daysCompleted || 0,
    total: habit.totalDays || 0,
    percentage: Math.round(((habit.daysCompleted || 0) / (habit.totalDays || 1)) * 100)
  }));
  
  // Process data for weekly view (placeholder - would be actual data in real app)
  const weeklyData = [
    { name: "Mon", completed: 3, total: 4 },
    { name: "Tue", completed: 4, total: 4 },
    { name: "Wed", completed: 2, total: 4 },
    { name: "Thu", completed: 3, total: 4 },
    { name: "Fri", completed: 4, total: 4 },
    { name: "Sat", completed: 1, total: 4 },
    { name: "Sun", completed: 2, total: 4 }
  ];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-xs text-primary">
            Completed: {payload[0].value} 
            {payload[1] ? ` / ${payload[1].payload.total}` : ""}
          </p>
          {payload[1] && (
            <p className="text-xs text-muted-foreground">
              {Math.round((payload[0].value / payload[1].payload.total) * 100)}% completion
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Calculate statistics
  const calculateStats = () => {
    if (habitData.length === 0) return { totalHabits: 0, completionRate: 0, streakDays: 0 };
    
    const totalCompleted = habitData.reduce((sum, habit) => sum + (habit.daysCompleted || 0), 0);
    const totalDays = habitData.reduce((sum, habit) => sum + (habit.totalDays || 0), 0);
    const completionRate = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;
    
    // Placeholder for streak calculation - would use actual historical data
    const streakDays = 5;
    
    return { totalHabits: habitData.length, completionRate, streakDays };
  };
  
  const stats = calculateStats();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <CardTitle className="ml-2">Habit Progress</CardTitle>
        </div>
        <CardDescription>Track your habit consistency</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="habits" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="habits">By Habit</TabsTrigger>
            <TabsTrigger value="days">By Day</TabsTrigger>
          </TabsList>
          
          <TabsContent value="habits" className="pt-4">
            {habitCompletionData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={habitCompletionData}
                    layout="vertical"
                    margin={{ top: 5, right: 5, bottom: 5, left: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="percentage" fill="#9b87f5" radius={[0, 4, 4, 0]}>
                      {habitCompletionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.percentage >= 75 ? "#4ade80" : 
                                entry.percentage >= 50 ? "#60a5fa" : 
                                entry.percentage >= 25 ? "#facc15" : "#f87171"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No habits available for tracking.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="days" className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 5, right: 5, bottom: 20, left: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4 border-t pt-6">
        <div className="grid grid-cols-3 gap-4 w-full">
          <Card className="p-4 text-center">
            <CardTitle className="text-2xl font-bold">{stats.totalHabits}</CardTitle>
            <CardDescription>Active Habits</CardDescription>
          </Card>
          
          <Card className="p-4 text-center">
            <CardTitle className="text-2xl font-bold">{stats.completionRate}%</CardTitle>
            <CardDescription>Completion Rate</CardDescription>
          </Card>
          
          <Card className="p-4 text-center">
            <CardTitle className="text-2xl font-bold">{stats.streakDays}</CardTitle>
            <CardDescription>Day Streak</CardDescription>
          </Card>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Insights</h4>
          <p className="text-sm text-muted-foreground">
            {habitData.length > 0 
              ? `You're most consistent with ${getMostConsistentHabit(habitCompletionData)}. ${getConsistencyMessage(stats.completionRate)}`
              : "Add habits to start tracking your progress."}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper functions
function getMostConsistentHabit(data: any[]): string {
  if (data.length === 0) return "";
  
  const mostConsistent = data.reduce((prev, current) => {
    return (prev.percentage > current.percentage) ? prev : current;
  });
  
  return mostConsistent.name;
}

function getConsistencyMessage(completionRate: number): string {
  if (completionRate >= 80) {
    return "Your overall habit consistency is excellent!";
  } else if (completionRate >= 60) {
    return "You have good habit consistency overall.";
  } else if (completionRate >= 40) {
    return "Try to improve your consistency with daily reminders.";
  } else {
    return "Focus on building one habit at a time to improve consistency.";
  }
}
