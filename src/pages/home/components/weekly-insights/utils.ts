
export const calculateMoodTrend = (recentAvg: number, prevAvg: number): number => {
  return prevAvg > 0 
    ? Math.round(((recentAvg - prevAvg) / prevAvg) * 100) 
    : (recentAvg > 0 ? 100 : 0);
};

export const getMoodScores = (): Record<string, number> => {
  return {
    "amazing": 5, 
    "good": 4, 
    "okay": 3, 
    "sad": 2, 
    "awful": 1
  };
};
