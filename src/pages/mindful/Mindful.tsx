
import { useUser } from "@/contexts/UserContext";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindfulHeader from "./components/MindfulHeader";
import BreathingExercises from "./components/breathing/BreathingExercises";
import MindfulnessExercises from "./components/mindfulness/MindfulnessExercises";
import MentalHealthQuiz from "./components/quiz/MentalHealthQuiz";
import ProgressTracker from "./components/progress/ProgressTracker";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Flower, Heart, Shield, CloudSun, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { mindfulSummaryStats } from "./data/summaryData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default function Mindful() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("breathing");
  const [openCardDialog, setOpenCardDialog] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Scroll tabs into view on mobile when tab changes
  useEffect(() => {
    if (isMobile && tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, isMobile]);
  
  const InfoCard = ({ stat }: { stat: typeof mindfulSummaryStats[0] }) => {
    const MobileDrawer = (
      <Drawer>
        <DrawerTrigger asChild>
          <Card 
            key={stat.id}
            className={cn(
              "overflow-hidden border-border/50 transition-all hover:shadow-md cursor-pointer",
              stat.color === "purple" && "bg-gradient-to-br from-purple-50/30 to-transparent",
              stat.color === "blue" && "bg-gradient-to-br from-blue-50/30 to-transparent",
              stat.color === "orange" && "bg-gradient-to-br from-orange-50/30 to-transparent",
              stat.color === "green" && "bg-gradient-to-br from-green-50/30 to-transparent"
            )}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-full",
                stat.color === "purple" && "bg-purple-100",
                stat.color === "blue" && "bg-blue-100",
                stat.color === "orange" && "bg-orange-100",
                stat.color === "green" && "bg-green-100"
              )}>
                <stat.icon className={cn(
                  "h-5 w-5",
                  stat.color === "purple" && "text-purple-600",
                  stat.color === "blue" && "text-blue-600",
                  stat.color === "orange" && "text-orange-500",
                  stat.color === "green" && "text-green-600"
                )} />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2 pr-4">{stat.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="pt-6 pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                stat.color === "purple" && "bg-purple-100",
                stat.color === "blue" && "bg-blue-100",
                stat.color === "orange" && "bg-orange-100",
                stat.color === "green" && "bg-green-100"
              )}>
                <stat.icon className={cn(
                  "h-5 w-5",
                  stat.color === "purple" && "text-purple-600",
                  stat.color === "blue" && "text-blue-600",
                  stat.color === "orange" && "text-orange-500",
                  stat.color === "green" && "text-green-600"
                )} />
              </div>
              {stat.title}
            </DrawerTitle>
            <DrawerDescription>
              {stat.description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <h3 className="font-medium mb-2">Benefits:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {stat.benefits.map((benefit, index) => (
                <li key={index} className="text-sm">{benefit}</li>
              ))}
            </ul>
            <h3 className="font-medium mb-2 mt-4">How it works:</h3>
            <p className="text-sm text-muted-foreground">{stat.howItWorks}</p>
          </div>
        </DrawerContent>
      </Drawer>
    );
    
    const DesktopDialog = (
      <Dialog>
        <DialogTrigger asChild>
          <Card 
            key={stat.id}
            className={cn(
              "overflow-hidden border-border/50 transition-all hover:shadow-md cursor-pointer",
              stat.color === "purple" && "bg-gradient-to-br from-purple-50/30 to-transparent",
              stat.color === "blue" && "bg-gradient-to-br from-blue-50/30 to-transparent",
              stat.color === "orange" && "bg-gradient-to-br from-orange-50/30 to-transparent",
              stat.color === "green" && "bg-gradient-to-br from-green-50/30 to-transparent"
            )}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-full",
                stat.color === "purple" && "bg-purple-100",
                stat.color === "blue" && "bg-blue-100",
                stat.color === "orange" && "bg-orange-100",
                stat.color === "green" && "bg-green-100"
              )}>
                <stat.icon className={cn(
                  "h-5 w-5",
                  stat.color === "purple" && "text-purple-600",
                  stat.color === "blue" && "text-blue-600",
                  stat.color === "orange" && "text-orange-500",
                  stat.color === "green" && "text-green-600"
                )} />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">{stat.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                stat.color === "purple" && "bg-purple-100",
                stat.color === "blue" && "bg-blue-100",
                stat.color === "orange" && "bg-orange-100",
                stat.color === "green" && "bg-green-100"
              )}>
                <stat.icon className={cn(
                  "h-5 w-5",
                  stat.color === "purple" && "text-purple-600",
                  stat.color === "blue" && "text-blue-600",
                  stat.color === "orange" && "text-orange-500",
                  stat.color === "green" && "text-green-600"
                )} />
              </div>
              {stat.title}
            </DialogTitle>
            <DialogDescription>
              {stat.description}
            </DialogDescription>
          </DialogHeader>
          <div className="px-1 py-4">
            <h3 className="font-medium mb-2">Benefits:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {stat.benefits.map((benefit, index) => (
                <li key={index} className="text-sm">{benefit}</li>
              ))}
            </ul>
            <h3 className="font-medium mb-2 mt-4">How it works:</h3>
            <p className="text-sm text-muted-foreground">{stat.howItWorks}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
    
    return isMobile ? MobileDrawer : DesktopDialog;
  };
  
  return (
    <div className="space-y-6">
      <MindfulHeader username={user?.username || 'Friend'} />
      
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        {mindfulSummaryStats.map(stat => (
          <InfoCard key={stat.id} stat={stat} />
        ))}
      </div>
      
      <div className="relative" ref={tabsRef}>
        <div className="absolute -z-10 top-1/3 left-1/4 w-24 h-24 md:w-40 md:h-40 rounded-full bg-purple-100/20 blur-3xl"></div>
        <div className="absolute -z-10 bottom-0 right-1/4 w-24 h-24 md:w-40 md:h-40 rounded-full bg-blue-100/20 blur-3xl"></div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6 bg-background/50 backdrop-blur-md border border-border/50 rounded-full p-1 w-full">
            <TabsTrigger 
              value="breathing" 
              className="rounded-full text-xs sm:text-sm data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
            >
              Breathing
            </TabsTrigger>
            <TabsTrigger 
              value="mindfulness" 
              className="rounded-full text-xs sm:text-sm data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
            >
              Mindfulness
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="rounded-full text-xs sm:text-sm data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
            >
              Quiz
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="rounded-full text-xs sm:text-sm data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
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
      
      <Drawer>
        <DrawerTrigger asChild>
          <div className={cn(
            "fixed bottom-20 right-6 z-30 p-4 rounded-full bg-mindscape-light shadow-md",
            "animate-pulse-soft transition-all"
          )}>
            <Flower className="text-mindscape-primary w-6 h-6" />
          </div>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="pt-6 pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-mindscape-light">
                <Flower className="h-5 w-5 text-mindscape-primary" />
              </div>
              Quick Mindfulness Tips
            </DrawerTitle>
            <DrawerDescription>
              Simple practices you can do anytime, anywhere
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">1. One-Minute Breathing</h3>
              <p className="text-sm text-muted-foreground">
                Close your eyes and take slow, deep breaths for just one minute. Focus only on the sensation of breathing.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">2. Five Senses Check-in</h3>
              <p className="text-sm text-muted-foreground">
                Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">3. Body Scan</h3>
              <p className="text-sm text-muted-foreground">
                Starting from your toes, mentally scan up through your body, noticing any tension and letting it go.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">4. Gratitude Moment</h3>
              <p className="text-sm text-muted-foreground">
                Pause and think of three things you're grateful for right now, no matter how small.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">5. Mindful Observation</h3>
              <p className="text-sm text-muted-foreground">
                Choose any object and observe it for one minute as if you've never seen it before, noticing all its details.
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
