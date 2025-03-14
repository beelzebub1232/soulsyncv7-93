
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MindfulHeader } from "./components/MindfulHeader";
import { BreathingExercises } from "./components/breathing/BreathingExercises";
import { MindfulnessExercises } from "./components/mindfulness/MindfulnessExercises";
import { MentalHealthQuiz } from "./components/quiz/MentalHealthQuiz";
import { ProgressTracking } from "./components/progress/ProgressTracking";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

export default function Mindful() {
  const { toast } = useToast();
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage("mindful-first-visit", true);

  useEffect(() => {
    if (isFirstVisit) {
      toast({
        title: "Welcome to Mindful",
        description: "Discover guided breathing, mindfulness practices, and self-assessment tools to support your mental well-being.",
        duration: 5000,
      });
      setIsFirstVisit(false);
    }
  }, [isFirstVisit, setIsFirstVisit, toast]);

  return (
    <ScrollArea className="h-full">
      <div className="container p-4 space-y-6 pb-24">
        <MindfulHeader />
        <BreathingExercises />
        <MindfulnessExercises />
        <MentalHealthQuiz />
        <ProgressTracking />
      </div>
    </ScrollArea>
  );
}
