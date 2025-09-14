import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
       <h1 className="font-headline text-3xl font-bold tracking-tight">
        Settings
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Gym Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Gym settings management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
