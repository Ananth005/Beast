import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckInPage() {
  return (
    <div className="space-y-6">
       <h1 className="font-headline text-3xl font-bold tracking-tight">
        Member Check-in
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Check-in System</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Quick member check-in feature coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
