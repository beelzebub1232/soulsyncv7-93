
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit, RotateCcw, Play, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizResult, QuizRecommendation } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { breathingExercises } from "../../data/breathingExercises";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";

interface QuizResultsProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
}

export default function QuizResults({ result, onRetakeQuiz }: QuizResultsProps) {
  const [activeTab, setActiveTab] = useState("results");
  
  const getColorForScore = (score: number) => {
    if (score < 30) return "green";
    if (score < 60) return "orange";
    return "red";
  };
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "stress": return "Stress";
      case "anxiety": return "Anxiety";
      case "mood": return "Mood";
      case "focus": return "Focus";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  const getCategoryDescription = (category: string, level: string) => {
    switch (category) {
      case "stress":
        if (level === "High") return "You're experiencing significant stress levels that may be affecting your daily life.";
        if (level === "Moderate") return "You're handling some stress, but have room for improvement in stress management.";
        return "Your stress levels appear to be well-managed.";
        
      case "anxiety":
        if (level === "High") return "You're experiencing notable anxiety symptoms that may benefit from attention.";
        if (level === "Moderate") return "You have some anxiety symptoms that could be addressed.";
        return "Your anxiety levels appear to be well-managed.";
        
      case "mood":
        if (level === "High") return "Your mood patterns show some challenges that may benefit from attention.";
        if (level === "Moderate") return "Your mood is relatively stable with some fluctuations.";
        return "Your mood appears to be stable and positive.";
        
      case "focus":
        if (level === "High") return "You're maintaining good focus and attention.";
        if (level === "Moderate") return "You have moderate ability to maintain focus.";
        return "You may be experiencing some challenges with focus and attention.";
        
      default:
        return "No specific description available.";
    }
  };
  
  const getExercisesFromRecommendation = (recommendation: QuizRecommendation) => {
    const allExercises = recommendation.exerciseType === "breathing" 
      ? breathingExercises 
      : mindfulnessExercises;
      
    return allExercises.filter(ex => recommendation.exerciseIds.includes(ex.id));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-mindscape-primary" />
          Quiz Results
        </h2>
        <span className="text-sm text-muted-foreground">
          {format(new Date(result.date), "MMM d, yyyy")}
        </span>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6 bg-background/50 backdrop-blur-md border border-border/50 rounded-full p-1">
          <TabsTrigger 
            value="results" 
            className="rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
          >
            Results
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations" 
            className="rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
          >
            Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="mt-0 space-y-4">
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Mental Health Profile</CardTitle>
              <CardDescription>
                Based on your responses, here's a summary of your current state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.categoryScores.map((categoryScore) => (
                <div key={categoryScore.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{getCategoryTitle(categoryScore.category)}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      categoryScore.level === "Low" && "text-green-500",
                      categoryScore.level === "Moderate" && "text-orange-500",
                      categoryScore.level === "High" && categoryScore.category === "focus" ? "text-green-500" : "text-red-500",
                    )}>
                      {categoryScore.level}
                    </span>
                  </div>
                  <Progress 
                    value={categoryScore.score} 
                    className="h-2"
                    indicatorClassName={cn(
                      getColorForScore(categoryScore.score) === "green" && "bg-green-500",
                      getColorForScore(categoryScore.score) === "orange" && "bg-orange-500",
                      getColorForScore(categoryScore.score) === "red" && "bg-red-500"
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    {getCategoryDescription(categoryScore.category, categoryScore.level)}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={onRetakeQuiz}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-0 space-y-4">
          <h3 className="text-lg font-medium">Recommended Exercises</h3>
          <p className="text-muted-foreground mb-4">
            Based on your results, we recommend these exercises to support your mental wellbeing:
          </p>
          
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {result.recommendations.length > 0 ? (
                result.recommendations.map((recommendation, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-medium">For {getCategoryTitle(recommendation.category)}:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {getExercisesFromRecommendation(recommendation).map((exercise) => (
                        <Card 
                          key={exercise.id}
                          className={cn(
                            "overflow-hidden transition-all hover:shadow-md",
                            exercise.color === "blue" && "bg-gradient-to-br from-blue-50 to-transparent border-blue-200/50",
                            exercise.color === "purple" && "bg-gradient-to-br from-purple-50 to-transparent border-purple-200/50",
                            exercise.color === "green" && "bg-gradient-to-br from-green-50 to-transparent border-green-200/50",
                            exercise.color === "orange" && "bg-gradient-to-br from-orange-50 to-transparent border-orange-200/50"
                          )}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">{exercise.name}</CardTitle>
                            <CardDescription className="text-xs">{exercise.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="link"
                              className={cn(
                                "p-0 h-auto",
                                exercise.color === "blue" && "text-blue-600",
                                exercise.color === "purple" && "text-purple-600",
                                exercise.color === "green" && "text-green-600",
                                exercise.color === "orange" && "text-orange-600"
                              )}
                              onClick={() => setActiveTab(recommendation.exerciseType === "breathing" ? "breathing" : "mindfulness")}
                            >
                              Go to exercise
                              <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <Card className="border border-border/50">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Great job! No specific recommendations needed based on your results.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
