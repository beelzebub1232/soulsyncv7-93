
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MentalHealthQuiz() {
  return (
    <Card className="overflow-hidden border-mindscape-light/30">
      <CardHeader className="space-y-1 bg-gradient-to-br from-green-100/50 via-mindscape-light/30 to-transparent">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-mindscape-primary" />
          <CardTitle className="text-xl">Mental Health Check-In</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <p className="text-muted-foreground">
          Take a quick assessment to understand your current mental well-being and get personalized recommendations.
        </p>
        <Button className="w-full group bg-mindscape-primary hover:bg-mindscape-secondary text-white">
          Start Assessment
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
