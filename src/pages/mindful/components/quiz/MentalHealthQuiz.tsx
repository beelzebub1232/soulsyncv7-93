
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MentalHealthQuiz() {
  return (
    <Card className="bg-gradient-to-br from-mindscape-light to-background">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-mindscape-primary" />
          <CardTitle>Mental Health Check-In</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Take a quick assessment to understand your current mental well-being and get personalized recommendations.
        </p>
        <Button className="w-full group">
          Start Assessment
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
