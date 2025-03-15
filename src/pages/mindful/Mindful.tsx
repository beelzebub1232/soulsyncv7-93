
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindfulHeader from "./components/MindfulHeader";
import BreathingExercises from "./components/breathing/BreathingExercises";
import MindfulnessExercises from "./components/mindfulness/MindfulnessExercises";
import MentalHealthQuiz from "./components/quiz/MentalHealthQuiz";
import ProgressTracker from "./components/progress/ProgressTracker";
import { Brain, Heart, Shield, CloudSun, Plus } from "lucide-react";
import { mindfulSummaryStats } from "./data/summaryData";
import MindfulSummaryCard from "./components/shared/MindfulSummaryCard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Mindful() {
  const [activeTab, setActiveTab] = useState("breathing");
  
  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto">
      <MindfulHeader username="User" />
      
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 mt-4">
        {mindfulSummaryStats.map((stat) => (
          <MindfulSummaryCard key={stat.id} stat={stat} />
        ))}
      </div>
      
      {/* Main Tabs */}
      <Tabs 
        defaultValue="breathing" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList className="w-full sm:w-auto grid grid-cols-4 h-auto p-1">
            <TabsTrigger 
              value="breathing"
              className="py-2 px-3 text-xs sm:text-sm data-[state=active]:text-mindscape-primary"
            >
              Breathing
            </TabsTrigger>
            <TabsTrigger 
              value="mindfulness" 
              className="py-2 px-3 text-xs sm:text-sm data-[state=active]:text-mindscape-primary"
            >
              Mindfulness
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="py-2 px-3 text-xs sm:text-sm data-[state=active]:text-mindscape-primary"
            >
              Quiz
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="py-2 px-3 text-xs sm:text-sm data-[state=active]:text-mindscape-primary"
            >
              Progress
            </TabsTrigger>
          </TabsList>
        </div>
        
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
      </Tabs>
      
      {/* Floating Action Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full fixed bottom-20 right-4 shadow-lg bg-mindscape-primary hover:bg-mindscape-primary/90 z-10"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Quick Mindfulness</SheetTitle>
            <SheetDescription>
              Choose a quick exercise to boost your mental wellbeing
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => {
                setActiveTab("breathing");
                document.querySelector('[data-state="open"]')?.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'Escape' })
                );
              }}
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-blue-200"
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <CloudSun className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-medium">Quick Breathing</span>
              <span className="text-xs text-muted-foreground">2-5 minutes</span>
            </Button>
            
            <Button 
              onClick={() => {
                setActiveTab("mindfulness");
                document.querySelector('[data-state="open"]')?.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'Escape' })
                );
              }}
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200"
            >
              <div className="p-3 bg-purple-100 rounded-full">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <span className="font-medium">Body Scan</span>
              <span className="text-xs text-muted-foreground">3-5 minutes</span>
            </Button>
            
            <Button 
              onClick={() => {
                setActiveTab("mindfulness");
                document.querySelector('[data-state="open"]')?.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'Escape' })
                );
              }}
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-green-200"
            >
              <div className="p-3 bg-green-100 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium">Stress Relief</span>
              <span className="text-xs text-muted-foreground">5 minutes</span>
            </Button>
            
            <Button
              onClick={() => {
                setActiveTab("quiz");
                document.querySelector('[data-state="open"]')?.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'Escape' })
                );
              }}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-orange-200"
            >
              <div className="p-3 bg-orange-100 rounded-full">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <span className="font-medium">Take Quiz</span>
              <span className="text-xs text-muted-foreground">Get personalized recommendations</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
