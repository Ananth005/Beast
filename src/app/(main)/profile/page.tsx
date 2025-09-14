import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
        Profile
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile & Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User profile, stats, and notification settings coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
