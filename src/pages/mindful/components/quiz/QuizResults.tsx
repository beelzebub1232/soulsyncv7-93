
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft, Award, BarChart, DownloadCloud, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { QuizResultsProps } from "../../types";

export default function QuizResults({ answers, onRestart, onExit }: QuizResultsProps) {
  // Placeholder results - in a real app, this would be calculated based on answers
  const results = {
    stress: { score: 7, level: "Moderate" },
    sleep: { score: 5, level: "Good" },
    focus: { score: 8, level: "Needs Attention" },
    resilience: { score: 6, level: "Moderate" }
  };
  
  const getColorForScore = (score: number) => {
    if (score <= 4) return "text-green-500";
    if (score <= 7) return "text-amber-500";
    return "text-red-500";
  };
  
  const getRecommendations = () => {
    return [
      {
        category: "Stress Management",
        description: "Techniques to help you manage stress and anxiety",
        exercises: [
          { id: "breathing-1", name: "4-7-8 Breathing Technique", type: "breathing" },
          { id: "mindfulness-2", name: "Body Scan Meditation", type: "mindfulness" }
        ]
      },
      {
        category: "Focus Enhancement",
        description: "Exercises to improve concentration and mental clarity",
        exercises: [
          { id: "breathing-3", name: "Box Breathing", type: "breathing" },
          { id: "mindfulness-4", name: "Mindful Observation", type: "mindfulness" }
        ]
      }
    ];
  };
  
  const recommendations = getRecommendations();
  
  return (
    <Card className="border-2 border-mindscape-light max-w-3xl mx-auto">
      <CardHeader className="bg-mindscape-light/20 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-mindscape-tertiary">Your Mental Wellness Assessment</CardTitle>
          <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <CardDescription>Based on your responses, we've created a personalized assessment</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full justify-start px-6 pt-4">
          <TabsTrigger value="summary" className="data-[state=active]:bg-mindscape-primary/10">
            <BarChart className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-mindscape-primary/10">
            <ListChecks className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="p-0">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-mindscape-primary" />
                Your Wellness Scores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(results).map(([category, result]) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={category}
                    className="bg-background border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium capitalize">{category}</h4>
                      <span className={cn("font-medium", getColorForScore(result.score))}>
                        {result.level}
                      </span>
                    </div>
                    <div className="bg-muted h-2 rounded-full">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          result.score <= 4 ? "bg-green-500" : 
                          result.score <= 7 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${(result.score / 10) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Overall Assessment</h3>
              <p className="text-muted-foreground">
                Your results indicate moderate levels of stress and good resilience. 
                You may benefit from exercises focused on improving focus and stress management.
                The mindfulness practices we've recommended can help address these areas.
              </p>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="recommendations" className="p-0">
          <CardContent className="p-6">
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={rec.category}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-medium text-lg mb-1">{rec.category}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{rec.description}</p>
                  
                  <div className="space-y-2">
                    {rec.exercises.map(exercise => (
                      <div key={exercise.id} className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {exercise.type} Exercise
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8">
                            Try Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={onRestart}>
          Retake Assessment
        </Button>
        <Button className="bg-mindscape-primary hover:bg-mindscape-primary/90">
          <DownloadCloud className="h-4 w-4 mr-2" />
          Save Results
        </Button>
      </CardFooter>
    </Card>
  );
}
