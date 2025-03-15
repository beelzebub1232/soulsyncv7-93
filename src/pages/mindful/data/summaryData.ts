
import { MindfulStat } from "../types";
import { Brain, Heart, CloudSun, Shield } from "lucide-react";

export const mindfulSummaryStats: MindfulStat[] = [
  {
    id: "brain-health",
    title: "Brain Health",
    description: "Regular meditation has been shown to increase gray matter density in brain regions associated with memory, empathy, and attention.",
    icon: Brain,
    color: "purple",
    benefits: [
      "Increases gray matter concentration in brain regions involved in learning and memory",
      "Improves attention span and focus",
      "Enhances cognitive flexibility and mental clarity",
      "May slow age-related cognitive decline"
    ],
    research: "A 2011 study at Harvard found that mindfulness meditation practice led to increases in regional brain gray matter density, suggesting meditation may be a neuroprotective factor."
  },
  {
    id: "stress-reduction",
    title: "Stress Reduction",
    description: "Mindfulness practices can lower cortisol levels, helping to reduce the physical impacts of stress on your body.",
    icon: Heart,
    color: "blue",
    benefits: [
      "Reduces cortisol (stress hormone) levels",
      "Calms the nervous system's fight-or-flight response",
      "Decreases blood pressure and heart rate",
      "Improves emotional regulation"
    ],
    research: "Research published in the Journal of Health Psychology found that mindfulness-based interventions show consistent improvement in stress reduction and regulation of the body's stress response."
  },
  {
    id: "mood-improvement",
    title: "Mood Improvement",
    description: "Mindfulness meditation can help regulate emotions and increase positive mood states.",
    icon: CloudSun,
    color: "orange",
    benefits: [
      "Reduces symptoms of depression and anxiety",
      "Increases feelings of well-being and happiness",
      "Improves ability to manage difficult emotions",
      "Helps develop greater self-compassion"
    ],
    research: "A meta-analysis in JAMA Internal Medicine found moderate evidence that mindfulness meditation programs can reduce anxiety, depression, and pain levels."
  },
  {
    id: "immune-function",
    title: "Immune Function",
    description: "Regular meditation may support immune function by reducing inflammation and improving cell-mediated immunity.",
    icon: Shield,
    color: "green",
    benefits: [
      "Reduces inflammatory markers in the body",
      "Strengthens immune cell activity",
      "Improves recovery from illness",
      "Contributes to overall physical resilience"
    ],
    research: "A study at the University of Wisconsin-Madison found that mindfulness meditation training was associated with reduced expression of inflammatory genes and improved immune function."
  }
];
