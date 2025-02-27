
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface EmotionAnalysisProps {
  moodData: any[];
  onBack: () => void;
}

export function EmotionAnalysis({ moodData, onBack }: EmotionAnalysisProps) {
  // Process data for pie chart
  const processMoodData = () => {
    if (moodData.length === 0) return [];
    
    // Count occurrences of each mood
    const moodCounts: Record<string, number> = {
      "amazing": 0,
      "good": 0,
      "okay": 0,
      "sad": 0,
      "awful": 0
    };
    
    moodData.forEach(mood => {
      const moodValue = mood.value || mood.mood;
      if (moodValue && moodCounts[moodValue] !== undefined) {
        moodCounts[moodValue] += 1;
      }
    });
    
    // Convert to array format for chart
    return Object.entries(moodCounts)
      .filter(([_, count]) => count > 0) // Only include moods with counts > 0
      .map(([mood, count]) => ({
        name: mood.charAt(0).toUpperCase() + mood.slice(1), // Capitalize
        value: count
      }));
  };
  
  const chartData = processMoodData();
  
  // Colors for each mood
  const COLORS = {
    "Amazing": "#4ade80", // green
    "Good": "#60a5fa",    // blue
    "Okay": "#facc15",    // yellow
    "Sad": "#fb923c",     // orange
    "Awful": "#f87171"    // red
  };
  
  // Analyze mood patterns
  const analyzeMoodPatterns = () => {
    if (moodData.length < 5) return "Record more mood entries to see detailed emotion analysis.";
    
    const moodCounts = chartData.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {} as Record<string, number>);
    
    // Find the most common mood
    let mostCommonMood = "";
    let highestCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > highestCount) {
        mostCommonMood = mood;
        highestCount = count;
      }
    });
    
    // Calculate percentage of positive moods (Amazing + Good)
    const totalEntries = moodData.length;
    const positiveCount = (moodCounts["Amazing"] || 0) + (moodCounts["Good"] || 0);
    const positivePercentage = Math.round((positiveCount / totalEntries) * 100);
    
    // Generate message based on data
    let message = `Your most frequent mood is "${mostCommonMood}". `;
    
    if (positivePercentage >= 70) {
      message += `Overall, your mood has been positive ${positivePercentage}% of the time, which is excellent for mental well-being.`;
    } else if (positivePercentage >= 50) {
      message += `You've been in a positive mood ${positivePercentage}% of the time, showing good emotional balance.`;
    } else if (positivePercentage >= 30) {
      message += `Your positive moods account for ${positivePercentage}% of entries. Consider activities that boost your mood.`;
    } else {
      message += `Only ${positivePercentage}% of your recorded moods have been positive. This might be a good time to focus on self-care.`;
    }
    
    return message;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <CardTitle className="ml-2">Emotion Analysis</CardTitle>
        </div>
        <CardDescription>Understand your emotional patterns</CardDescription>
      </CardHeader>
      
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No mood data available for analysis.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col space-y-4 border-t pt-6">
        <div>
          <h4 className="font-medium text-sm mb-2">Analysis</h4>
          <p className="text-sm text-muted-foreground">
            {moodData.length > 0 ? analyzeMoodPatterns() : "Start tracking your mood to see emotional patterns."}
          </p>
        </div>
        
        {moodData.length > 0 && (
          <div className="pt-2">
            <h4 className="font-medium text-sm mb-2">Suggestions</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
              <li>
                {chartData.find(item => item.name === "Amazing" || item.name === "Good") 
                  ? "Continue activities that correlate with your positive moods" 
                  : "Try incorporating more activities that bring you joy"}
              </li>
              <li>
                {chartData.find(item => item.name === "Sad" || item.name === "Awful") 
                  ? "Practice mindfulness during challenging emotions" 
                  : "Maintain your emotional awareness practices"}
              </li>
              <li>Journal about emotional triggers to better understand your patterns</li>
            </ul>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
