import { StatCard } from './stat-card';
import { Users, TrendingUp, DollarSign, UserCheck } from 'lucide-react';
import { AttendanceTrendsChart } from './charts';
import { revenueData, members } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function OwnerDashboard() {
  const activeMembersToday = members.filter(m => new Date(m.lastVisit).toDateString() === new Date().toDateString()).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Business Dashboard
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Users Today"
          value={activeMembersToday.toString()}
          icon={UserCheck}
          description="Members who checked in"
        />
        <StatCard
          title="Total Members"
          value={members.length.toString()}
          icon={Users}
          description="+2 this month"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${revenueData.monthly.toLocaleString()}`}
          icon={DollarSign}
          description={`$${revenueData.pending} pending`}
        />
        <StatCard
          title="Attendance"
          value="Up 5%"
          icon={TrendingUp}
          description="Compared to last week"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <AttendanceTrendsChart />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
                <CardDescription>Members who visited today.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {members.slice(0, 5).map(member => (
                        <li key={member.id} className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{new Date(member.lastVisit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
