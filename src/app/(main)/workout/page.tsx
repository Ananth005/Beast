import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkoutPage() {
  return (
    <div className="space-y-6">
       <h1 className="font-headline text-3xl font-bold tracking-tight">
        Log Workout
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Workout Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Workout logging feature coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
