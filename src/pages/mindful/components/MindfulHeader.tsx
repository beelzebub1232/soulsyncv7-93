
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function MindfulHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-mindscape-primary animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mindful Practice</h1>
            <p className="text-muted-foreground mt-1">Your daily dose of calm and clarity</p>
          </div>
        </div>
      </div>
      
      <Card className={cn(
        "bg-gradient-to-br from-mindscape-primary/20 via-mindscape-primary/10 to-transparent",
        "border-none shadow-lg"
      )}>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Welcome to Your Mindful Journey</h2>
          <p className="text-muted-foreground">
            Take a moment to breathe, reflect, and center yourself with our guided exercises and practices. Choose from various sessions designed to help you find peace and balance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
