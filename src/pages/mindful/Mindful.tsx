
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindfulHeader from "./components/MindfulHeader";
import BreathingExercises from "./components/breathing/BreathingExercises";
import MindfulnessExercises from "./components/mindfulness/MindfulnessExercises";
import MentalHealthQuiz from "./components/quiz/MentalHealthQuiz";
import ProgressTracker from "./components/progress/ProgressTracker";
import { AnimatePresence, motion } from "framer-motion";
import { Flower, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Mindful() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("breathing");
  
  return (
    <div className="space-y-6">
      <MindfulHeader username={user?.username || 'Friend'} />
      
      <div className="relative">
        <div className="absolute -z-10 top-1/3 left-1/4 w-40 h-40 rounded-full bg-purple-100/20 blur-3xl"></div>
        <div className="absolute -z-10 bottom-0 right-1/4 w-40 h-40 rounded-full bg-blue-100/20 blur-3xl"></div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6 bg-background/50 backdrop-blur-md border border-border/50 rounded-full p-1">
            <TabsTrigger 
              value="breathing" 
              className="rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
            >
              Breathing
            </TabsTrigger>
            <TabsTrigger 
              value="mindfulness" 
              className="rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
            >
              Mindfulness
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
            >
              Quiz
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="rounded-full data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
            >
              Progress
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="breathing" className="mt-0">
                <BreathingExercises />
              </TabsContent>
              
              <TabsContent value="mindfulness" className="mt-0">
                <MindfulnessExercises />
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-0">
                <MentalHealthQuiz />
              </TabsContent>
              
              <TabsContent value="progress" className="mt-0">
                <ProgressTracker />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
      
      <div className={cn(
        "fixed bottom-20 right-6 z-30 p-4 rounded-full bg-mindscape-light shadow-md",
        "animate-bounce-soft transition-all"
      )}>
        <Flower className="text-mindscape-primary w-6 h-6" />
      </div>
    </div>
  );
}
