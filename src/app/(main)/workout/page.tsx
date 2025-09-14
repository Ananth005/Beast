import { WorkoutForm } from "@/components/workout/workout-form";
import { format } from 'date-fns';

export default function WorkoutPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Log Workout
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>
      <WorkoutForm />
    </div>
  );
}
