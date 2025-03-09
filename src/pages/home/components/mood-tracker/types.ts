
// Define mood types
export type MoodValue = "amazing" | "good" | "okay" | "sad" | "awful";

export interface Mood {
  value: MoodValue;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// Define mood storage interface
export interface MoodEntry {
  value: MoodValue;
  date: Date;
  note?: string;
}
