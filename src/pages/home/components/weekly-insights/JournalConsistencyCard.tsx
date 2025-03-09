
import { BookText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface JournalConsistencyCardProps {
  journalConsistency: number;
}

export function JournalConsistencyCard({ journalConsistency }: JournalConsistencyCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-medium">Journal Consistency</h3>
          <BookText className={`h-4 w-4 ${journalConsistency >= 50 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          {journalConsistency >= 50 
            ? "Good journaling habits this week" 
            : "Try to journal more regularly"}
        </p>
        
        <Progress 
          className="h-2"
          value={journalConsistency}
          indicatorClassName={journalConsistency >= 50 
            ? "bg-gradient-to-r from-blue-300 to-blue-500" 
            : "bg-gradient-to-r from-orange-300 to-red-400"}
        />
      </CardContent>
    </Card>
  );
}
