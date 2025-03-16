interface QuizResultsProps {
  answers: Record<string, string>;
  onRestart: () => void;
  onExit: () => void;
}

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { questions } from "../../data/quizQuestions";
import { useEffect, useState } from "react";

export default function QuizResults({ answers, onRestart, onExit }: QuizResultsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  useEffect(() => {
    // Analyze answers and generate recommendations
    const analysis = analyzeAnswers(answers);
    setRecommendations(analysis.recommendations);
  }, [answers]);
  
  const analyzeAnswers = (answers: Record<string, string>) => {
    let stressLevel = 0;
    let sleepQuality = 0;
    let focusAbility = 0;
    let emotionalRegulation = 0;
    
    // Map answers to numerical values
    const answerValues: { [key: string]: number } = {
      "rarely": 1,
      "sometimes": 2,
      "often": 3,
      "frequently": 4,
      "excellent": 1,
      "good": 2,
      "fair": 3,
      "poor": 4,
      "none": 4,
      "little": 3,
      "moderate": 2,
      "significant": 1,
      "calm": 1,
      "reactive": 3,
      "avoidant": 4
    };
    
    // Analyze stress levels
    if (answers["q1"]) {
      stressLevel = answerValues[answers["q1"]] || 0;
    }
    
    // Analyze sleep quality
    if (answers["q2"]) {
      sleepQuality = answerValues[answers["q2"]] || 0;
    }
    
    // Analyze focus ability
    if (answers["q3"]) {
      focusAbility = answerValues[answers["q3"]] || 0;
    }
    
    // Analyze emotional regulation
    if (answers["q7"]) {
      emotionalRegulation = answerValues[answers["q7"]] || 0;
    }
    
    // Generate recommendations based on analysis
    const recommendations: string[] = [];
    
    if (stressLevel >= 3) {
      recommendations.push("Try deep breathing exercises to reduce stress and anxiety.");
    }
    
    if (sleepQuality >= 3) {
      recommendations.push("Practice relaxation techniques before bed to improve sleep quality.");
    }
    
    if (focusAbility >= 3) {
      recommendations.push("Engage in mindfulness meditation to improve focus and concentration.");
    }
    
    if (emotionalRegulation >= 3) {
      recommendations.push("Explore emotional regulation techniques to manage stress.");
    }
    
    // Add more specific recommendations based on the "What area of wellbeing would you most like to improve?" question
    if (answers["q6"] === "stress") {
      recommendations.push("Consider progressive muscle relaxation for stress relief.");
    } else if (answers["q6"] === "sleep") {
      recommendations.push("Establish a consistent sleep schedule for better sleep.");
    } else if (answers["q6"] === "focus") {
      recommendations.push("Practice focused attention meditation to enhance concentration.");
    } else if (answers["q6"] === "emotional") {
      recommendations.push("Try loving-kindness meditation to foster emotional regulation.");
    }
    
    return {
      recommendations
    };
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Results</CardTitle>
        <CardDescription>Based on your answers, here are some personalized recommendations:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm">{recommendation}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No specific recommendations at this time. Consider exploring general mindfulness practices.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onExit}>
          Exit
        </Button>
        <Button onClick={onRestart}>
          Retake Assessment
        </Button>
      </CardFooter>
    </Card>
  );
}
