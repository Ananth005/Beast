import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
        Your Progress
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Progress & Streaks</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Progress tracking, streak calendar, and body metrics coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
