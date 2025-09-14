export type UserRole = 'user' | 'owner';

export type Member = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastVisit: string;
  membershipStatus: 'active' | 'inactive' | 'frozen';
  avatarUrl: string;
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  category: 'strength' | 'cardio' | 'flexibility';
};

export type WorkoutSet = {
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  userId: string;
  date: string; // ISO string
  exercises: WorkoutExercise[];
};

export type Payment = {
  id: string;
  memberId: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
};

export type PersonalRecord = {
  exerciseName: string;
  value: string;
  date: string;
};
