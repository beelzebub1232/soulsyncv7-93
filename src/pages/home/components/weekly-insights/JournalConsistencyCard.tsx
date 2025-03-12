
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface JournalConsistencyCardProps {
  journalConsistency: number | null;
}

export function JournalConsistencyCard({ journalConsistency }: JournalConsistencyCardProps) {
  const hasJournalData = journalConsistency !== null && journalConsistency > 0;
  
  return (
    <Card className="h-full overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Journal Consistency</h3>
            <BookOpen className={`h-5 w-5 ${hasJournalData ? (journalConsistency >= 50 ? 'text-blue-500' : 'text-orange-400') : 'text-gray-300'}`} />
          </div>
          <p className="text-xs text-muted-foreground">
            {hasJournalData
              ? (journalConsistency >= 50 
                ? "Good journaling habits this week" 
                : "Try to journal more regularly")
              : "Start writing in your journal"}
          </p>
        </div>
        
        <Progress 
          className="h-2 mt-3"
          value={hasJournalData ? journalConsistency : 0}
          indicatorClassName={hasJournalData && journalConsistency >= 50 
            ? "bg-gradient-to-r from-blue-300 to-blue-500" 
            : "bg-gradient-to-r from-orange-300 to-red-400"}
        />
      </CardContent>
    </Card>
  );
}
