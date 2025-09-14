import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembersPage() {
  return (
    <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
        Member Management
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Member management features (add, edit, search) coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
