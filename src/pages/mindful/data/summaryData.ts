
import { Brain, Heart, Shield, CloudSun, MindfulStat } from "../types";

export const mindfulSummaryStats: MindfulStat[] = [
  {
    id: "brain-health",
    title: "Brain Health",
    description: "Improve cognitive function and neuroplasticity",
    icon: Brain,
    color: "purple",
    benefits: [
      "Increases gray matter density in brain regions related to attention",
      "Strengthens neural connections and pathways",
      "May slow age-related cognitive decline",
      "Improves memory and concentration"
    ],
    howItWorks: "Regular mindfulness practice activates brain regions associated with attention, sensory processing, and self-awareness. This consistent activation promotes neuroplasticity—the brain's ability to form new neural connections throughout life."
  },
  {
    id: "stress-reduction",
    title: "Stress Reduction",
    description: "Lower cortisol levels and reduce stress responses",
    icon: CloudSun,
    color: "blue",
    benefits: [
      "Decreases cortisol (stress hormone) levels",
      "Activates the parasympathetic nervous system",
      "Helps manage anxiety and worry patterns",
      "Creates emotional resilience to stressors"
    ],
    howItWorks: "Mindfulness activates the body's relaxation response and deactivates the stress response. Deep breathing exercises specifically signal your nervous system to calm down, lowering heart rate, blood pressure, and stress hormone production."
  },
  {
    id: "mood-improvement",
    title: "Mood Improvement",
    description: "Increase positive emotions and emotional regulation",
    icon: Heart,
    color: "orange",
    benefits: [
      "Reduces symptoms of depression",
      "Enhances emotional awareness and regulation",
      "Increases positive emotions and experiences",
      "Develops greater self-compassion"
    ],
    howItWorks: "Mindfulness helps break the cycle of rumination and negative thinking patterns that contribute to low mood. By learning to observe thoughts without judgment, you can develop a healthier relationship with challenging emotions."
  },
  {
    id: "immune-function",
    title: "Immune Function",
    description: "Support immune system through stress management",
    icon: Shield,
    color: "green",
    benefits: [
      "Reduces inflammation markers in the body",
      "May increase activity of natural killer cells",
      "Supports overall immune system resilience",
      "Helps manage autoimmune responses"
    ],
    howItWorks: "By reducing stress, mindfulness prevents the immune-suppressing effects of stress hormones. Studies show that regular practitioners have stronger immune responses and may recover more quickly from illness and infection."
  }
];
