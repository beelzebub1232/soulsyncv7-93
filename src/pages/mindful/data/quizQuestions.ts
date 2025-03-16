
import { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "How often do you feel overwhelmed or stressed?",
    options: [
      { value: "1", label: "Rarely or never" },
      { value: "2", label: "Occasionally" },
      { value: "3", label: "Often" },
      { value: "4", label: "Most of the time" }
    ],
    category: "stress"
  },
  {
    id: "q2",
    question: "How would you rate your ability to focus on tasks?",
    options: [
      { value: "1", label: "Excellent - I rarely get distracted" },
      { value: "2", label: "Good - I can focus most of the time" },
      { value: "3", label: "Fair - I get distracted sometimes" },
      { value: "4", label: "Poor - I struggle to maintain focus" }
    ],
    category: "focus"
  },
  {
    id: "q3",
    question: "How often do you experience difficulty falling or staying asleep?",
    options: [
      { value: "1", label: "Rarely or never" },
      { value: "2", label: "Once or twice a week" },
      { value: "3", label: "Several times a week" },
      { value: "4", label: "Almost every night" }
    ],
    category: "sleep"
  },
  {
    id: "q4",
    question: "How would you describe your energy levels throughout the day?",
    options: [
      { value: "1", label: "Consistently high" },
      { value: "2", label: "Generally good with occasional dips" },
      { value: "3", label: "Variable - high at times but often low" },
      { value: "4", label: "Frequently low or depleted" }
    ],
    category: "energy"
  },
  {
    id: "q5",
    question: "How often do you engage in activities purely for relaxation or enjoyment?",
    options: [
      { value: "1", label: "Daily" },
      { value: "2", label: "Several times a week" },
      { value: "3", label: "Once a week or less" },
      { value: "4", label: "Rarely or never" }
    ],
    category: "balance"
  },
  {
    id: "q6",
    question: "How would you rate your ability to stay calm in challenging situations?",
    options: [
      { value: "1", label: "Excellent - I rarely lose my composure" },
      { value: "2", label: "Good - I usually stay calm" },
      { value: "3", label: "Fair - I sometimes become anxious or upset" },
      { value: "4", label: "Poor - I often become overwhelmed" }
    ],
    category: "resilience"
  },
  {
    id: "q7",
    question: "How often do you feel disconnected from your body or physical sensations?",
    options: [
      { value: "1", label: "Rarely or never" },
      { value: "2", label: "Occasionally" },
      { value: "3", label: "Often" },
      { value: "4", label: "Most of the time" }
    ],
    category: "bodyawareness"
  },
  {
    id: "q8",
    question: "How would you describe your thought patterns?",
    options: [
      { value: "1", label: "Mostly positive and constructive" },
      { value: "2", label: "Generally balanced" },
      { value: "3", label: "Often ruminative or worrying" },
      { value: "4", label: "Frequently negative or self-critical" }
    ],
    category: "thought"
  },
  {
    id: "q9",
    question: "How often do you feel a sense of peace or contentment?",
    options: [
      { value: "1", label: "Frequently throughout each day" },
      { value: "2", label: "Several times a week" },
      { value: "3", label: "Occasionally" },
      { value: "4", label: "Rarely or never" }
    ],
    category: "peace"
  },
  {
    id: "q10",
    question: "How would you rate your self-awareness of emotions?",
    options: [
      { value: "1", label: "Excellent - I'm very aware of what I'm feeling" },
      { value: "2", label: "Good - I usually understand my emotions" },
      { value: "3", label: "Fair - I sometimes struggle to identify feelings" },
      { value: "4", label: "Poor - I often don't know what I'm feeling" }
    ],
    category: "emotional"
  }
];
