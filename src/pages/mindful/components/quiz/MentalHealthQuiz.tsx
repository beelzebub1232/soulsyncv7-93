
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import QuizResults from "./QuizResults";
import { questions } from "../../data/quizQuestions";

interface MentalHealthQuizProps {
  onQuizStart?: () => void;
  onQuizEnd?: () => void;
}

export default function MentalHealthQuiz({ onQuizStart, onQuizEnd }: MentalHealthQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentStep(0);
    setAnswers({});
    setQuizComplete(false);
    if (onQuizStart) onQuizStart();
  };
  
  const handleAnswerSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const goToNextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Quiz is complete
      setQuizComplete(true);
      if (onQuizEnd) onQuizEnd();
    }
  };
  
  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setQuizComplete(false);
    setQuizStarted(false);
    if (onQuizEnd) onQuizEnd();
  };
  
  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  
  if (!quizStarted) {
    return (
      <Card className="border-2 border-dashed border-border/80">
        <CardHeader>
          <CardTitle>Mental Health Assessment</CardTitle>
          <CardDescription>
            Take this quick assessment to better understand your mental wellbeing and get personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">What you'll learn:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-green-600">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Personalized mindfulness recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-blue-600">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Insights into stress and anxiety levels</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-purple-600">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Suggested breathing and meditation exercises</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50/50 p-3 rounded-md text-sm">
            <p className="text-muted-foreground">This is not a clinical diagnostic tool. If you're experiencing severe symptoms, please consult a healthcare professional.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startQuiz} className="w-full">
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (quizComplete) {
    return (
      <QuizResults
        answers={answers}
        onRestart={resetQuiz}
        onExit={resetQuiz}
      />
    );
  }
  
  return (
    <div className="pb-16">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-muted-foreground">
          Question {currentStep + 1} of {questions.length}
        </div>
        <Button variant="ghost" size="sm" onClick={resetQuiz} className="h-8 gap-1">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Restart</span>
        </Button>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
              {currentQuestion.description && (
                <CardDescription>{currentQuestion.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={currentAnswer || ''} 
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div 
                    key={option.value} 
                    className={cn(
                      "flex items-center space-x-2 border rounded-md p-3 cursor-pointer transition-all",
                      currentAnswer === option.value ? "border-primary bg-primary/5" : "hover:bg-accent"
                    )}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="w-full cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={goToNextQuestion} 
                disabled={!currentAnswer} 
                className="w-full"
                size="lg"
              >
                {currentStep < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "See Results"
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
