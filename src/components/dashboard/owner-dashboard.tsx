import { StatCard } from './stat-card';
import { Users, TrendingUp, Rupee, UserCheck } from 'lucide-react';
import { AttendanceTrendsChart } from './charts';
import { revenueData, members } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnnouncementBanner } from './announcement-banner';
import { CreateAnnouncement } from './create-announcement';
import Link from 'next/link';

export function OwnerDashboard() {
  const activeMembersToday = members.filter(m => new Date(m.lastVisit).toDateString() === new Date().toDateString()).length;
  const recentCheckins = members.filter(m => new Date(m.lastVisit).toDateString() === new Date().toDateString()).slice(0,5);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Business Dashboard
      </h1>
      <AnnouncementBanner />
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
          value={`₹${revenueData.monthly.toLocaleString()}`}
          icon={Rupee}
          description={`₹${revenueData.pending} pending`}
        />
        <StatCard
          title="Attendance"
          value="Up 5%"
          icon={TrendingUp}
          description="Compared to last week"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <AttendanceTrendsChart />
            <CreateAnnouncement />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
                <CardDescription>Members who visited today.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {recentCheckins.length > 0 ? recentCheckins.map(member => (
                        <li key={member.id}>
                          <Link href={`/members/${member.id}`} className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-lg">
                            <Avatar>
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{new Date(member.lastVisit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </Link>
                        </li>
                    )) : (
                      <p className="text-muted-foreground text-sm text-center py-8">No check-ins yet today.</p>
                    )}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
