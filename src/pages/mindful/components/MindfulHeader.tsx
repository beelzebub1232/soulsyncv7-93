
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Feather } from "lucide-react";

export function MindfulHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Feather className="h-6 w-6 text-mindscape-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Mindful Practice</h1>
      </div>
      
      <Card className={cn(
        "bg-gradient-to-br from-mindscape-light to-background",
        "border-none shadow-md"
      )}>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Welcome to your mindfulness journey. Take a moment to breathe, reflect, and center yourself with our guided exercises and practices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
