
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Wind, 
  Sparkles, 
  Flame, 
  Leaf, 
  BookOpen, 
  HeartPulse 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMood } from "../../components/mood-tracker/use-mood";

type ActivitySuggestion = {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
};

export function MoodSuggestions() {
  const { selectedMood } = useMood();
  
  const suggestions = useMemo(() => {
    if (!selectedMood) return [];
    
    // Define suggestions based on mood
    switch (selectedMood) {
      case "anxious":
      case "stressed":
        return [
          {
            title: "Calming Breath",
            description: "Reduce anxiety with slow, deep breathing",
            icon: <Wind className="h-5 w-5 text-blue-500" />,
            path: "/mindful/breathing/calming-breath"
          },
          {
            title: "Box Breathing",
            description: "A simple technique to reduce stress",
            icon: <Brain className="h-5 w-5 text-purple-500" />,
            path: "/mindful/breathing/box-breathing"
          }
        ];
        
      case "angry":
        return [
          {
            title: "4-7-8 Breathing",
            description: "Calm your nervous system and release tension",
            icon: <Flame className="h-5 w-5 text-orange-500" />,
            path: "/mindful/breathing/4-7-8-breathing"
          },
          {
            title: "Mindfulness Quiz",
            description: "Explore your mental health needs",
            icon: <BookOpen className="h-5 w-5 text-indigo-500" />,
            path: "/mindful/quiz"
          }
        ];
        
      case "sad":
      case "awful":
        return [
          {
            title: "Deep Breathing",
            description: "Restore emotional balance with deep breaths",
            icon: <HeartPulse className="h-5 w-5 text-red-500" />,
            path: "/mindful/breathing/deep-breathing"
          },
          {
            title: "Mindfulness Quiz",
            description: "Get personalized mental wellness recommendations",
            icon: <Brain className="h-5 w-5 text-purple-500" />,
            path: "/mindful/quiz"
          }
        ];
        
      case "energetic":
        return [
          {
            title: "Energizing Breath",
            description: "Channel your energy positively",
            icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
            path: "/mindful/breathing/energizing-breath"
          }
        ];
        
      case "tired":
        return [
          {
            title: "Energizing Breath",
            description: "Boost energy and combat fatigue",
            icon: <Sparkles className="h-5 w-5 text-amber-500" />,
            path: "/mindful/breathing/energizing-breath"
          },
          {
            title: "Box Breathing",
            description: "Increase alertness and focus",
            icon: <Brain className="h-5 w-5 text-blue-500" />,
            path: "/mindful/breathing/box-breathing"
          }
        ];
        
      case "peaceful":
      case "calm":
        return [
          {
            title: "Alternate Nostril",
            description: "Maintain and deepen your sense of calm",
            icon: <Leaf className="h-5 w-5 text-green-500" />,
            path: "/mindful/breathing/alternate-nostril"
          }
        ];
        
      case "amazing":
      case "good":
      case "okay":
      default:
        return [
          {
            title: "Box Breathing",
            description: "Maintain emotional balance with simple breathing",
            icon: <Wind className="h-5 w-5 text-blue-500" />,
            path: "/mindful/breathing/box-breathing"
          },
          {
            title: "Mindfulness Quiz",
            description: "Discover exercises tailored to your needs",
            icon: <BookOpen className="h-5 w-5 text-purple-500" />,
            path: "/mindful/quiz"
          }
        ];
    }
  }, [selectedMood]);
  
  if (!selectedMood || suggestions.length === 0) {
    return null;
  }
  
  return (
    <Card className="p-4 bg-gradient-to-r from-mindscape-light/20 to-transparent">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-mindscape-tertiary">Recommended for You</h2>
        <p className="text-xs text-muted-foreground">Based on your current mood</p>
      </div>
      
      <div className="flex flex-col gap-2.5">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto flex items-center justify-start gap-2.5 p-2.5 border border-mindscape-light hover:bg-mindscape-light/20"
            asChild
          >
            <Link to={suggestion.path}>
              <div className="rounded-full p-2 bg-white/50 min-w-[36px] flex items-center justify-center">
                {suggestion.icon}
              </div>
              <div className="text-left flex-1 overflow-hidden">
                <h3 className="font-medium text-sm truncate">{suggestion.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{suggestion.description}</p>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </Card>
  );
}
