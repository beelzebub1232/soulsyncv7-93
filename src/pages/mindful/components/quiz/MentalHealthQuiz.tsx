
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MentalHealthQuiz() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mental Health Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Take a quick assessment to understand your current mental well-being.
        </p>
      </CardContent>
    </Card>
  );
}
