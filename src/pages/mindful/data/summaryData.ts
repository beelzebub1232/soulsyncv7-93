
import { MindfulStat } from "../types";
import { Brain, Heart, CloudSun, Shield } from "lucide-react";

export const mindfulSummaryStats: MindfulStat[] = [
  {
    id: "brain-health",
    title: "Brain Health",
    description: "Regular meditation has been shown to increase gray matter density in brain regions associated with memory, empathy, and attention.",
    icon: Brain,
    color: "purple"
  },
  {
    id: "stress-reduction",
    title: "Stress Reduction",
    description: "Mindfulness practices can lower cortisol levels, helping to reduce the physical impacts of stress on your body.",
    icon: Heart,
    color: "blue"
  },
  {
    id: "mood-improvement",
    title: "Mood Improvement",
    description: "Mindfulness meditation can help regulate emotions and increase positive mood states.",
    icon: CloudSun,
    color: "orange"
  },
  {
    id: "immune-function",
    title: "Immune Function",
    description: "Regular meditation may support immune function by reducing inflammation and improving cell-mediated immunity.",
    icon: Shield,
    color: "green"
  }
];
