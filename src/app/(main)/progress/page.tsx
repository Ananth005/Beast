import { StreakCalendar } from "@/components/progress/streak-calendar";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
        Your Progress
      </h1>
      <StreakCalendar />
    </div>
  );
}
