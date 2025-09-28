

'use server';

import { db } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { 
    members, 
    payments,
    exercises,
    historicalPerformance,
    leaderboardData as initialLeaderboards,
    challenges,
    announcements,
    personalRecords,
    currentWorkout
} from '@/lib/mock-data';
import { LeaderboardCategory } from '@/app/(main)/leaderboard/page';
import { Plan } from '../types';

const plans: Plan[] = [
    { id: 'plan1', name: 'Monthly', price: 1000, duration: 30 },
    { id: 'plan2', name: 'Quarterly', price: 2500, duration: 90 },
    { id: 'plan3', name: 'Yearly', price: 9000, duration: 365 },
];

export async function seedDatabase() {
    try {
        const batch = writeBatch(db);

        // Seed members
        const membersCollection = collection(db, 'members');
        members.forEach(member => {
            const memberDocRef = doc(membersCollection, member.id);
            batch.set(memberDocRef, member);
        });

        // Seed payments
        const paymentsCollection = collection(db, 'payments');
        payments.forEach(payment => {
            const paymentDocRef = doc(paymentsCollection, payment.id);
            batch.set(paymentDocRef, {...payment, planId: 'plan1'});
        });

        // Seed exercises
        const exercisesCollection = collection(db, 'exercises');
        exercises.forEach(exercise => {
            const exerciseDocRef = doc(exercisesCollection, exercise.id);
            batch.set(exerciseDocRef, exercise);
        });

        // Seed historicalPerformance (Workouts) for a specific user 'user1'
        const workoutsCollection = collection(db, 'users', 'user1', 'workouts');
        historicalPerformance.forEach(workout => {
             const workoutDocRef = doc(workoutsCollection, workout.id);
             batch.set(workoutDocRef, workout);
        });
        
         // Seed currentWorkout for a specific user 'user1'
        const currentWorkoutData = {
            id: 'current',
            userId: 'user1',
            date: new Date().toISOString(),
            exercises: currentWorkout,
        }
        const currentWorkoutDocRef = doc(db, 'users', 'user1', 'workouts', 'current');
        batch.set(currentWorkoutDocRef, currentWorkoutData);


        // Seed personalRecords for a specific user 'user1'
        const personalRecordsCollection = collection(db, 'users', 'user1', 'personal-records');
        personalRecords.forEach(record => {
            // creating an ID from exerciseName
            const recordId = record.exerciseName.replace(/\s+/g, '-').toLowerCase();
            const recordDocRef = doc(personalRecordsCollection, recordId);
            batch.set(recordDocRef, record);
        });

        // Seed leaderboards
        const leaderboardsCollection = collection(db, 'leaderboards');
        Object.entries(initialLeaderboards).forEach(([title, records]) => {
            const newLeaderboard: Omit<LeaderboardCategory, 'id'> = {
                title,
                records: records.sort((a,b) => a.rank - b.rank)
            };
            const leaderboardDocRef = doc(leaderboardsCollection, title.replace(/\s+/g, '-').toLowerCase());
            batch.set(leaderboardDocRef, newLeaderboard);
        });

        // Seed challenges
        const challengesCollection = collection(db, 'challenges');
        challenges.forEach(challenge => {
            const challengeDocRef = doc(challengesCollection, challenge.id);
            batch.set(challengeDocRef, challenge);
        });

        // Seed announcements
        const announcementsCollection = collection(db, 'announcements');
        announcements.forEach(announcement => {
            const announcementDocRef = doc(announcementsCollection, announcement.id);
            batch.set(announcementDocRef, announcement);
        });

        // Seed plans
        const plansCollection = collection(db, 'plans');
        plans.forEach(plan => {
            const planDocRef = doc(plansCollection, plan.id);
            batch.set(planDocRef, plan);
        });


        await batch.commit();
        console.log('Database seeded successfully!');

    } catch (error) {
        console.error("Error seeding database: ", error);
        throw new Error("Failed to seed database.");
    }
}
