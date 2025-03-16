import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, Info, ArrowLeft } from "lucide-react";
import { quizQuestions } from "../../data/quizQuestions";
import QuizResults from "./QuizResults";
import { QuizQuestion, QuizAnswer, QuizResult } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { v4 as uuidv4 } from 'uuid';

interface MentalHealthQuizProps {
  onSessionChange?: (inSession: boolean) => void;
}

export default function MentalHealthQuiz({ onSessionChange }: MentalHealthQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [progressLog, setProgressLog] = useLocalStorage<any[]>("mindful-progress-log", []);
  const [previousResults, setPreviousResults] = useLocalStorage<QuizResult[]>("mindful-quiz-results", []);
  
  // Notify parent component about quiz session state
  useEffect(() => {
    if (onSessionChange) {
      onSessionChange(currentQuestion > 0 || showResults);
    }
  }, [currentQuestion, showResults, onSessionChange]);
  
  const questions: QuizQuestion[] = quizQuestions;
  
  const handleAnswer = (value: number) => {
    const currentQ = questions[currentQuestion];
    
    // Update or add the answer
    const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQ.id);
    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = {
        questionId: currentQ.id,
        category: currentQ.category,
        value
      };
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, {
        questionId: currentQ.id,
        category: currentQ.category,
        value
      }]);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };
  
  const calculateResults = () => {
    // Group answers by category
    const categoriesMap = new Map<string, number[]>();
    
    answers.forEach(answer => {
      if (!categoriesMap.has(answer.category)) {
        categoriesMap.set(answer.category, []);
      }
      categoriesMap.get(answer.category)!.push(answer.value);
    });
    
    // Calculate score for each category
    const categoryScores = Array.from(categoriesMap.entries()).map(([category, values]) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      let level: string;
      
      if (average <= 2) {
        level = "Low";
      } else if (average <= 3.5) {
        level = "Moderate";
      } else {
        level = "High";
      }
      
      return { category, score: average, level };
    });
    
    // Generate recommendations based on scores
    const recommendations = categoryScores
      .filter(cat => cat.score <= 3) // Focus on areas with lower scores
      .map(cat => {
        const exerciseType = Math.random() > 0.5 ? "breathing" as const : "mindfulness" as const;
        let exerciseIds: string[] = [];
        
        // This is simplified - in a real app, you'd have more targeted recommendations
        if (exerciseType === "breathing") {
          exerciseIds = ["box-breathing", "4-7-8-breathing", "deep-breathing"];
          if (cat.category === "Anxiety") {
            exerciseIds = ["4-7-8-breathing", "calming-breath", "progressive-breath"];
          } else if (cat.category === "Stress") {
            exerciseIds = ["box-breathing", "calming-breath", "deep-breathing"];
          }
        } else {
          exerciseIds = ["body-scan", "loving-kindness", "mindful-eating"];
          if (cat.category === "Depression") {
            exerciseIds = ["loving-kindness", "gratitude-practice", "mindful-walking"];
          } else if (cat.category === "Focus") {
            exerciseIds = ["body-scan", "mindful-listening", "mindful-observation"];
          }
        }
        
        return {
          category: cat.category,
          exerciseType,
          exerciseIds
        };
      });
    
    const result: QuizResult = {
      categoryScores,
      recommendations,
      date: new Date().toISOString()
    };
    
    // Log quiz completion in progress tracker
    const newLogEntry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      exerciseId: "mental-health-quiz",
      exerciseType: "quiz",
      duration: 5 // Approximate time to complete quiz
    };
    
    setProgressLog([...progressLog, newLogEntry]);
    
    // Save quiz results for history
    setPreviousResults([...previousResults, result]);
    
    setQuizResult(result);
    setShowResults(true);
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizResult(null);
    
    if (onSessionChange) {
      onSessionChange(false);
    }
  };
  
  if (showResults && quizResult) {
    return <QuizResults result={quizResult} onRetakeQuiz={resetQuiz} quizType="stress-anxiety" />;
  }
  
  if (currentQuestion === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
            <Info className="h-5 w-5 text-mindscape-primary" />
            Mental Health Quiz
          </h2>
        </div>
        
        <Card className="border-mindscape-primary/20">
          <CardContent className="pt-6 text-center space-y-5">
            <div className="bg-mindscape-light/30 p-4 rounded-full inline-flex">
              <CheckCircle className="h-8 w-8 text-mindscape-primary" />
            </div>
            
            <h3 className="text-xl font-semibold text-mindscape-tertiary">
              Assess Your Mental Wellbeing
            </h3>
            
            <p className="text-sm text-muted-foreground">
              Take this short quiz to get personalized mindfulness and breathing exercise recommendations based on your current mental state.
            </p>
            
            <div className="bg-muted/40 p-4 rounded-lg text-xs text-left">
              <p className="font-medium mb-1">What to expect:</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                  <span>10 simple questions about how you're feeling</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                  <span>Takes about 2-3 minutes to complete</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                  <span>Get personalized recommendations</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                  <span>Your results are private and stored locally</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentQuestion(1)}
              className="w-full bg-mindscape-primary hover:bg-mindscape-primary/90"
            >
              Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        {previousResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Previous Results</h3>
            <ScrollArea className="h-[180px]">
              <div className="space-y-2">
                {previousResults
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((result, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {result.categoryScores.map((cat, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  cat.level === "Low" && "bg-red-100 text-red-800",
                                  cat.level === "Moderate" && "bg-yellow-100 text-yellow-800",
                                  cat.level === "High" && "bg-green-100 text-green-800"
                                )}
                              >
                                {cat.category}: {cat.level}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuizResult(result);
                            setShowResults(true);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    );
  }
  
  const question = questions[currentQuestion - 1];
  const progress = (currentQuestion / questions.length) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Question {currentQuestion} of {questions.length}</h3>
        <Button variant="ghost" size="sm" onClick={resetQuiz}>
          Cancel
        </Button>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <Card className="border-mindscape-primary/20">
        <CardContent className="pt-6">
          <h4 className="text-base font-medium mb-2">{question.text}</h4>
          <p className="text-sm text-muted-foreground mb-6">{question.description}</p>
          
          <RadioGroup
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">Never</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">Rarely</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">Sometimes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r4" />
              <Label htmlFor="r4">Often</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="r5" />
              <Label htmlFor="r5">Always</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={goToPreviousQuestion}
          disabled={currentQuestion <= 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {question.category}
        </div>
      </div>
    </div>
  );
}
