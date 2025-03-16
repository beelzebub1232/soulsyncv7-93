
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions } from "../../data/quizQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import QuizResults from "./QuizResults";
import { cn } from "@/lib/utils";
import { ArrowRight, Medal, Clock, CircleCheck, Sparkles } from "lucide-react";

interface MentalHealthQuizProps {
  onQuizStateChange?: (isActive: boolean) => void;
}

export default function MentalHealthQuiz({ onQuizStateChange }: MentalHealthQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Get total questions
  const totalQuestions = quizQuestions.length;
  
  // Get current question
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
    if (onQuizStateChange) {
      onQuizStateChange(true);
    }
  };
  
  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };
  
  const handleExitResults = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    if (onQuizStateChange) {
      onQuizStateChange(false);
    }
  };
  
  if (!quizStarted) {
    return (
      <Card className="border-2 border-mindscape-light">
        <CardHeader className="text-center bg-mindscape-light/20 pb-6">
          <CardTitle className="text-xl font-semibold text-mindscape-tertiary">Mental Health Assessment Quiz</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Medal className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Get Personalized Insights</h3>
                <p className="text-sm text-muted-foreground">Discover which mindfulness practices may benefit you most</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Takes Only 3 Minutes</h3>
                <p className="text-sm text-muted-foreground">Quick assessment with 10 simple questions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <CircleCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Science-Backed Assessment</h3>
                <p className="text-sm text-muted-foreground">Based on established mental health screening tools</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Improve Your Well-Being</h3>
                <p className="text-sm text-muted-foreground">Track your progress and see improvement over time</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={handleStartQuiz} 
            className="bg-mindscape-primary hover:bg-mindscape-primary/90 text-white w-full"
          >
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (showResults) {
    return (
      <QuizResults answers={answers} onRestart={handleRestartQuiz} onExit={handleExitResults} />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-2 rounded-lg border p-3 transition-colors",
                      answers[currentQuestion.id] === option.value
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex-grow cursor-pointer font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="outline"
                onClick={handleRestartQuiz}
              >
                Restart
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={!answers[currentQuestion.id]}
                className="bg-mindscape-primary hover:bg-mindscape-primary/90 text-white"
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "View Results"
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
