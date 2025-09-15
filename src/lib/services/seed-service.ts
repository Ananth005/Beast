
'use server';

import { db } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { 
    members, 
    payments,
    exercises,
    historicalPerformance,
    leaderboardData,
    challenges,
    announcements,
    personalRecords,
    currentWorkout
} from '@/lib/mock-data';

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
            batch.set(paymentDocRef, payment);
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
        for (const category in leaderboardData) {
            const categoryDocRef = doc(leaderboardsCollection, category.replace(/\s+/g, '-').toLowerCase());
            batch.set(categoryDocRef, { category: category, records: leaderboardData[category] });
        }

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

        await batch.commit();
        console.log('Database seeded successfully!');

    } catch (error) {
        console.error("Error seeding database: ", error);
        throw new Error("Failed to seed database.");
    }
}
