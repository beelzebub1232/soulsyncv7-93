
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit, ArrowRight, BarChart2, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { quizQuestions } from "../../data/quizQuestions";
import { QuizAnswer, QuizQuestion, QuizRecommendation, QuizResult } from "../../types";
import QuizResults from "./QuizResults";

export default function MentalHealthQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
  };
  
  const handleAnswerSelect = (question: QuizQuestion, answerValue: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: question.id,
      category: question.category,
      value: answerValue
    };
    
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };
  
  const calculateResults = (quizAnswers: QuizAnswer[]) => {
    // Calculate scores for each category
    const categories = [...new Set(quizAnswers.map(a => a.category))];
    const categoryScores = categories.map(category => {
      const categoryAnswers = quizAnswers.filter(a => a.category === category);
      const totalScore = categoryAnswers.reduce((sum, answer) => sum + answer.value, 0);
      const maxPossibleScore = categoryAnswers.length * 4; // Assuming 0-4 scale
      const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);
      
      let level = "Low";
      if (percentageScore >= 75) level = "High";
      else if (percentageScore >= 40) level = "Moderate";
      
      return {
        category,
        score: percentageScore,
        level
      };
    });
    
    // Generate recommendations based on scores
    const recommendations: QuizRecommendation[] = [];
    
    // Stress recommendations
    const stressScore = categoryScores.find(c => c.category === "stress")?.score || 0;
    if (stressScore >= 75) {
      recommendations.push({
        category: "stress",
        exerciseType: "breathing",
        exerciseIds: ["box-breathing", "4-7-8-breathing"]
      });
    } else if (stressScore >= 40) {
      recommendations.push({
        category: "stress",
        exerciseType: "breathing",
        exerciseIds: ["deep-breathing"]
      });
    }
    
    // Anxiety recommendations
    const anxietyScore = categoryScores.find(c => c.category === "anxiety")?.score || 0;
    if (anxietyScore >= 60) {
      recommendations.push({
        category: "anxiety",
        exerciseType: "mindfulness",
        exerciseIds: ["body-scan", "progressive-muscle-relaxation"]
      });
    } else if (anxietyScore >= 30) {
      recommendations.push({
        category: "anxiety",
        exerciseType: "mindfulness",
        exerciseIds: ["mindful-breathing"]
      });
    }
    
    // Focus recommendations
    const focusScore = categoryScores.find(c => c.category === "focus")?.score || 0;
    if (focusScore <= 40) {
      recommendations.push({
        category: "focus",
        exerciseType: "mindfulness",
        exerciseIds: ["mindful-awareness", "present-moment"]
      });
    }
    
    setQuizResult({
      categoryScores,
      recommendations,
      date: new Date().toISOString()
    });
    
    setQuizCompleted(true);
  };
  
  if (quizCompleted && quizResult) {
    return (
      <QuizResults 
        result={quizResult} 
        onRetakeQuiz={startQuiz}
      />
    );
  }
  
  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-md bg-gradient-to-br from-purple-50 to-transparent border-purple-200/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-mindscape-primary" />
              Mental Health Quiz
            </CardTitle>
            <CardDescription>
              Take this quick assessment to get personalized mindfulness recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>This quiz will help evaluate your current:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Stress levels</li>
                <li>Anxiety symptoms</li>
                <li>Mood patterns</li>
                <li>Focus and attention</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                It takes about 3 minutes to complete, and your answers are completely private.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={startQuiz}
              className="w-full flex items-center justify-center gap-2 bg-mindscape-primary hover:bg-mindscape-secondary"
            >
              Start Quiz
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-mindscape-primary" />
          Mental Health Quiz
        </h2>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 mb-6"
        indicatorClassName="bg-mindscape-primary"
      />
      
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
          <CardDescription>{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 0, label: "Not at all" },
              { value: 1, label: "A little bit" },
              { value: 2, label: "Moderately" },
              { value: 3, label: "Quite a bit" },
              { value: 4, label: "Extremely" }
            ].map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={cn(
                  "justify-start h-auto py-3 px-4 border-border/50",
                  answers[currentQuestionIndex]?.value === option.value && "border-mindscape-primary bg-mindscape-light/40"
                )}
                onClick={() => handleAnswerSelect(currentQuestion, option.value)}
              >
                {option.label}
                {answers[currentQuestionIndex]?.value === option.value && (
                  <CheckCheck className="h-4 w-4 ml-auto text-mindscape-primary" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
