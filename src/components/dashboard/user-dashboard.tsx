import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from './stat-card';
import { Flame, Target, Trophy, CalendarDays } from 'lucide-react';
import { WeeklyProgressChart } from './charts';
import { personalRecords } from '@/lib/mock-data';
import { SuggestedExercisesCard } from './suggested-exercises-card';
import { AnnouncementBanner } from './announcement-banner';

export function UserDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Your Dashboard
      </h1>
      <AnnouncementBanner />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Streak"
          value="12 Days"
          icon={Flame}
          description="Keep it up!"
        />
        <StatCard
          title="Workouts This Week"
          value="4"
          icon={CalendarDays}
          description="+1 from last week"
        />
        <StatCard
          title="Personal Records"
          value="3 New"
          icon={Trophy}
          description="This month"
        />
        <StatCard
          title="Next Goal"
          value="5K Run"
          icon={Target}
          description="In 2 weeks"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <WeeklyProgressChart />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Records</CardTitle>
              <CardDescription>Your all-time bests.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {personalRecords.slice(0, 3).map((record) => (
                  <li key={record.exerciseName} className="flex justify-between">
                    <span className="text-muted-foreground">{record.exerciseName}</span>
                    <span className="font-medium">{record.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <SuggestedExercisesCard />
        </div>
      </div>
    </div>
  );
}
