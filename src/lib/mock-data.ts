import type { Member, Workout, Payment, PersonalRecord, Exercise, WorkoutExercise } from './types';
import { subDays, formatISO } from 'date-fns';

export const members: Member[] = [
  { id: '1', name: 'John Doe', email: 'john.d@example.com', mobileNumber: '1234567890', joinDate: '2023-01-15', lastVisit: formatISO(subDays(new Date(), 1)), membershipStatus: 'active', avatarUrl: 'https://picsum.photos/seed/1/100/100' },
  { id: '2', name: 'Jane Smith', email: 'jane.s@example.com', mobileNumber: '2345678901', joinDate: '2022-11-20', lastVisit: formatISO(subDays(new Date(), 3)), membershipStatus: 'active', avatarUrl: 'https://picsum.photos/seed/2/100/100' },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@example.com', mobileNumber: '3456789012', joinDate: '2023-03-10', lastVisit: formatISO(subDays(new Date(), 35)), membershipStatus: 'inactive', avatarUrl: 'https://picsum.photos/seed/3/100/100' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@example.com', mobileNumber: '4567890123', joinDate: '2021-06-01', lastVisit: formatISO(subDays(new Date(), 5)), membershipStatus: 'active', avatarUrl: 'https://picsum.photos/seed/4/100/100' },
  { id: '5', name: 'Chris Brown', email: 'chris.b@example.com', mobileNumber: '5678901234', joinDate: '2023-08-01', lastVisit: formatISO(subDays(new Date(), 95)), membershipStatus: 'frozen', avatarUrl: 'https://picsum.photos/seed/5/100/100' },
];

export const exercises: Exercise[] = [
    { id: 'ex1', name: 'Bench Press', muscleGroup: 'Chest', category: 'strength' },
    { id: 'ex2', name: 'Squat', muscleGroup: 'Legs', category: 'strength' },
    { id: 'ex3', name: 'Deadlift', muscleGroup: 'Back', category: 'strength' },
    { id: 'ex4', name: 'Overhead Press', muscleGroup: 'Shoulders', category: 'strength' },
    { id: 'ex5', name: 'Pull Up', muscleGroup: 'Back', category: 'strength' },
    { id: 'ex6', name: 'Treadmill Run', muscleGroup: 'Full Body', category: 'cardio' },
];

export const currentWorkout: WorkoutExercise[] = [
    { exerciseId: 'ex1', exerciseName: 'Bench Press', sets: [{ reps: 8, weight: 135 }, { reps: 8, weight: 135 }, { reps: 6, weight: 145 }] },
    { exerciseId: 'ex2', exerciseName: 'Squat', sets: [{ reps: 10, weight: 185 }, { reps: 10, weight: 185 }, { reps: 8, weight: 205 }] },
];

export const historicalPerformance: Workout[] = [
  { 
    id: 'w1', 
    userId: 'user1', 
    date: formatISO(subDays(new Date(), 7)),
    exercises: [
      { exerciseId: 'ex1', exerciseName: 'Bench Press', sets: [{ reps: 8, weight: 130 }, { reps: 7, weight: 130 }, { reps: 6, weight: 130 }] },
      { exerciseId: 'ex2', exerciseName: 'Squat', sets: [{ reps: 10, weight: 180 }, { reps: 10, weight: 180 }, { reps: 8, weight: 195 }] },
    ]
  },
  { 
    id: 'w2', 
    userId: 'user1', 
    date: formatISO(subDays(new Date(), 14)),
    exercises: [
      { exerciseId: 'ex1', exerciseName: 'Bench Press', sets: [{ reps: 6, weight: 130 }, { reps: 6, weight: 130 }, { reps: 5, weight: 130 }] },
      { exerciseId: 'ex3', exerciseName: 'Deadlift', sets: [{ reps: 5, weight: 225 }, { reps: 5, weight: 225 }] },
    ]
  },
];


export const weeklyProgressData = [
  { day: 'Mon', volume: 4000 },
  { day: 'Tue', volume: 3000 },
  { day: 'Wed', volume: 5000 },
  { day: 'Thu', volume: 2780 },
  { day: 'Fri', volume: 1890 },
  { day: 'Sat', volume: 2390 },
  { day: 'Sun', volume: 0 },
];

export const personalRecords: PersonalRecord[] = [
  { exerciseName: 'Bench Press', value: '185 lbs', date: '2023-05-20' },
  { exerciseName: 'Squat', value: '225 lbs', date: '2023-05-22' },
  { exerciseName: 'Deadlift', value: '315 lbs', date: '2023-04-10' },
  { exerciseName: '1-Mile Run', value: '6:30', date: '2023-05-15' },
];


export const attendanceTrendsData = [
    { date: 'Mon', users: 65 },
    { date: 'Tue', users: 59 },
    { date: 'Wed', users: 80 },
    { date: 'Thu', users: 81 },
    { date: 'Fri', users: 56 },
    { date: 'Sat', users: 95 },
    { date: 'Sun', users: 40 },
];

export const revenueData = {
    total: 12500,
    monthly: 2500,
    pending: 450,
};

export const payments: Payment[] = [
  { id: 'p1', memberId: '1', name: 'John Doe', amount: 50, dueDate: '2023-06-01', status: 'paid', paidDate: '2023-05-28' },
  { id: 'p2', memberId: '2', name: 'Jane Smith', amount: 50, dueDate: '2023-06-01', status: 'pending' },
  { id: 'p3', memberId: '3', name: 'Mike Johnson', amount: 50, dueDate: '2023-05-01', status: 'overdue' },
  { id: 'p4', memberId: '4', name: 'Emily Davis', amount: 50, dueDate: '2023-06-01', status: 'paid', paidDate: '2023-05-25' },
];
