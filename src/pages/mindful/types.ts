
import { LucideIcon } from "lucide-react";

// Breathing Exercise Types
export interface BreathingPattern {
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export interface BreathingExerciseType {
  id: string;
  name: string;
  description: string;
  duration: number;
  level: string;
  color: string;
  pattern: BreathingPattern;
}

// Mindfulness Exercise Types
export interface MindfulnessStep {
  title: string;
  instruction: string;
  duration: number;
}

export interface MindfulnessExerciseType {
  id: string;
  name: string;
  description: string;
  duration: number;
  focus: string;
  color: string;
  level: string;
  steps: {
    title: string;
    instruction: string;
    duration: number;
  }[];
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface QuizAnswer {
  questionId: string;
  category: string;
  value: number;
}

export interface QuizCategoryScore {
  category: string;
  score: number;
  level: string;
}

export interface QuizRecommendation {
  category: string;
  exerciseType: "breathing" | "mindfulness";
  exerciseIds: string[];
}

export interface QuizResult {
  categoryScores: QuizCategoryScore[];
  recommendations: QuizRecommendation[];
  date: string;
}

// Progress Types
export interface ProgressLogItem {
  id: string;
  date: string;
  exerciseId: string;
  exerciseType: "breathing" | "mindfulness";
  duration: number;
}

export interface MindfulStat {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  benefits: string[];
  research: string;
}

// Component Props Types
export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  options: Array<{ label: string; value: string | null }>;
  activeFilter: string | null;
  onFilterChange: (value: string | null) => void;
}

export interface ExerciseCardProps {
  exercise: BreathingExerciseType | MindfulnessExerciseType;
  isFavorite: boolean;
  isCompleted?: boolean;
  onToggleFavorite: (id: string) => void;
  onStartSession: (id: string) => void;
}

export interface EmptyStateProps {
  onClearFilters: () => void;
}

export interface QuizResultsProps {
  answers: Record<string, string>;
  onRestart: () => void;
  onExit: () => void;
}
