
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface MoodTrendsProps {
  moodData: any[];
  onBack: () => void;
}

export function MoodTrends({ moodData, onBack }: MoodTrendsProps) {
  // Process data for charts
  const processDataForChart = (period: 'week' | 'month' | 'year') => {
    if (moodData.length === 0) return [];
    
    const moodValues: Record<string, number> = {
      "amazing": 5,
      "good": 4,
      "okay": 3,
      "sad": 2,
      "awful": 1
    };
    
    let cutoffDate = new Date();
    if (period === 'week') {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (period === 'month') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 1);
    } else {
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    }
    
    const periodData = moodData
      .filter(mood => {
        const moodDate = new Date(mood.date || mood.created_at);
        return moodDate >= cutoffDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.created_at);
        const dateB = new Date(b.date || b.created_at);
        return dateA.getTime() - dateB.getTime();
      })
      .map(mood => {
        const moodDate = new Date(mood.date || mood.created_at);
        const moodValue = mood.value || mood.mood;
        return {
          date: moodDate.toLocaleDateString(),
          value: moodValues[moodValue] || 3,
          mood: moodValue
        };
      });
      
    return periodData;
  };
  
  const weekData = processDataForChart('week');
  const monthData = processDataForChart('month');
  const yearData = processDataForChart('year');
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const moodNames: Record<number, string> = {
        5: "Amazing",
        4: "Good",
        3: "Okay",
        2: "Sad",
        1: "Awful"
      };
      
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-xs text-primary">
            Mood: {moodNames[payload[0].value]}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <CardTitle className="ml-2">Mood Trends</CardTitle>
        </div>
        <CardDescription>Visualize how your mood changes over time</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="week">Past Week</TabsTrigger>
            <TabsTrigger value="month">Past Month</TabsTrigger>
            <TabsTrigger value="year">Past Year</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="pt-4">
            {weekData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => {
                        const labels = {
                          5: "Amazing",
                          4: "Good",
                          3: "Okay",
                          2: "Sad",
                          1: "Awful"
                        };
                        return labels[value as keyof typeof labels] || "";
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={3} stroke="#9b87f5" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#9b87f5"
                      strokeWidth={2}
                      dot={{ fill: "#9b87f5", r: 4 }}
                      activeDot={{ r: 6, fill: "#7E69AB" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No mood data available for this period.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="month" className="pt-4">
            {monthData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => {
                        const labels = {
                          5: "Amazing",
                          4: "Good",
                          3: "Okay",
                          2: "Sad",
                          1: "Awful"
                        };
                        return labels[value as keyof typeof labels] || "";
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={3} stroke="#9b87f5" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#9b87f5"
                      strokeWidth={2}
                      dot={{ fill: "#9b87f5", r: 4 }}
                      activeDot={{ r: 6, fill: "#7E69AB" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No mood data available for this period.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="year" className="pt-4">
            {yearData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => {
                        const labels = {
                          5: "Amazing",
                          4: "Good",
                          3: "Okay",
                          2: "Sad",
                          1: "Awful"
                        };
                        return labels[value as keyof typeof labels] || "";
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={3} stroke="#9b87f5" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#9b87f5"
                      strokeWidth={2}
                      dot={{ fill: "#9b87f5", r: 4 }}
                      activeDot={{ r: 6, fill: "#7E69AB" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No mood data available for this period.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col items-start space-y-4 border-t pt-6">
        <div>
          <h4 className="font-medium text-sm mb-1">Insights</h4>
          {weekData.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              {weekData.length > 3 ? (
                <>
                  Your mood has been generally 
                  {calculateAverageMood(weekData) >= 4 ? (
                    <span className="text-green-500 font-medium"> positive</span>
                  ) : calculateAverageMood(weekData) >= 3 ? (
                    <span className="text-blue-500 font-medium"> balanced</span>
                  ) : (
                    <span className="text-orange-500 font-medium"> challenging</span>
                  )} this week.
                  {identifyTrend(weekData)}
                </>
              ) : (
                "Record more mood entries to see detailed insights."
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Start tracking your mood to see personalized insights.
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper functions for mood analysis
function calculateAverageMood(data: any[]): number {
  if (data.length === 0) return 0;
  
  const sum = data.reduce((acc, entry) => acc + entry.value, 0);
  return sum / data.length;
}

function identifyTrend(data: any[]): string {
  if (data.length < 3) return "";
  
  // Check last 3 entries
  const last3 = data.slice(-3);
  const increasing = last3[0].value < last3[1].value && last3[1].value < last3[2].value;
  const decreasing = last3[0].value > last3[1].value && last3[1].value > last3[2].value;
  
  if (increasing) {
    return " Your mood has been improving recently.";
  } else if (decreasing) {
    return " Your mood has been declining recently.";
  } else {
    return " Your mood has been fluctuating recently.";
  }
}
