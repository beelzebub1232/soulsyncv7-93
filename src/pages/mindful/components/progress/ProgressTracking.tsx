
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProgressTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Track your mindfulness journey and achievements.
        </p>
      </CardContent>
    </Card>
  );
}
