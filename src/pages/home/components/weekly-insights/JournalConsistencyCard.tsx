
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface JournalConsistencyCardProps {
  journalConsistency: number;
}

export function JournalConsistencyCard({ journalConsistency }: JournalConsistencyCardProps) {
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Journal Consistency</h3>
            <BookOpen className={`h-5 w-5 ${journalConsistency >= 50 ? 'text-blue-500' : 'text-orange-400'}`} />
          </div>
          <p className="text-xs text-muted-foreground">
            {journalConsistency >= 50 
              ? "Good journaling habits this week" 
              : "Try to journal more regularly"}
          </p>
        </div>
        
        <Progress 
          className="h-2 mt-3"
          value={journalConsistency}
          indicatorClassName={journalConsistency >= 50 
            ? "bg-gradient-to-r from-blue-300 to-blue-500" 
            : "bg-gradient-to-r from-orange-300 to-red-400"}
        />
      </CardContent>
    </Card>
  );
}
