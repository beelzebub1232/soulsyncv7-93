
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, HelpCircle, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  userId: string;
  username: string;
  question: string;
  category: string;
  date: Date;
  status: 'pending' | 'answered';
  answer?: string;
}

export function ProfessionalPendingQuestions() {
  const { toast } = useToast();
  const [answering, setAnswering] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      userId: "user123",
      username: "AnxiousUser",
      question: "I've been experiencing panic attacks at work. What are some quick techniques I can use to calm down?",
      category: "anxiety",
      date: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: "pending"
    },
    {
      id: "q2",
      userId: "user456",
      username: "SleeplessNights",
      question: "I've been having trouble sleeping for weeks. I've tried melatonin but it's not helping. Any professional advice?",
      category: "stress",
      date: new Date(Date.now() - 16 * 60 * 60 * 1000),
      status: "pending"
    },
    {
      id: "q3",
      userId: "user789",
      username: "MindfulSeeker",
      question: "What's the difference between mindfulness and meditation? How do I know which one is right for me?",
      category: "mindfulness",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "pending"
    }
  ]);

  const handleSubmitAnswer = (questionId: string) => {
    if (!answerText.trim()) {
      toast({
        variant: "destructive",
        title: "Empty answer",
        description: "Please provide an answer before submitting.",
      });
      return;
    }
    
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? {
        ...q, 
        status: 'answered',
        answer: answerText
      } : q)
    );
    
    toast({
      title: "Answer submitted",
      description: "Your professional response has been sent to the user.",
    });
    
    setAnswering(null);
    setAnswerText("");
  };

  const pendingQuestions = questions.filter(q => q.status === 'pending');

  if (pendingQuestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            User Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No pending questions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-purple-600" />
          User Questions ({pendingQuestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingQuestions.map((question) => (
          <div key={question.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {question.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(question.date, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-sm">{question.username}</p>
              </div>
              <p className="text-sm">{question.question}</p>
            </div>

            {answering === question.id ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your professional response here..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="min-h-24"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setAnswering(null);
                      setAnswerText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleSubmitAnswer(question.id)}
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setAnswering(question.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Answer Question
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
