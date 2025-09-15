export type UserRole = 'user' | 'owner';

export type Member = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
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
  id: string;
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
  id:string;
  memberId: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  planId?: string;
};

export type PersonalRecord = {
  exerciseName: string;
  value: string;
  date: string;
};

export type LeaderboardRecord = {
  rank: number;
  memberId: string;
  memberName: string;
  memberAvatarUrl: string;
  score: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  participantCount: number;
};

export type Announcement = {
  id: string;
  message: string;
  expiry: string; // ISO date string
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
};
