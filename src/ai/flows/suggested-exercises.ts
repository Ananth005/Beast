'use server';

/**
 * @fileOverview Provides AI-driven workout suggestions based on user performance data.
 *
 * - suggestExercises - The main function to get exercise suggestions.
 * - SuggestedExercisesInput - Input type for exercise suggestions.
 * - SuggestedExercisesOutput - Output type for exercise suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedExercisesInputSchema = z.object({
  currentWorkout: z
    .array(
      z.object({
        exerciseName: z.string(),
        sets: z.array(z.object({reps: z.number(), weight: z.number()})),
      })
    )
    .describe('The user\'s current workout.'),
  historicalPerformance: z
    .array(
      z.object({
        exerciseName: z.string(),
        sets: z.array(z.object({reps: z.number(), weight: z.number()})),
        date: z.string().describe('Date of the workout in ISO format'),
      })
    )
    .describe('The user\'s historical workout performance data.'),
  fitnessGoal: z.string().describe('The user\'s fitness goal (e.g., strength, endurance, muscle growth).'),
});

export type SuggestedExercisesInput = z.infer<typeof SuggestedExercisesInputSchema>;

const SuggestedExercisesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested exercises or variations.'),
});

export type SuggestedExercisesOutput = z.infer<typeof SuggestedExercisesOutputSchema>;

export async function suggestExercises(input: SuggestedExercisesInput): Promise<SuggestedExercisesOutput> {
  return suggestedExercisesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExercisesPrompt',
  input: {schema: SuggestedExercisesInputSchema},
  output: {schema: SuggestedExercisesOutputSchema},
  prompt: `You are a personal trainer AI. You will suggest new exercises to a user, or variations on their current exercises, based on their current workout, historical performance and their fitness goals.

Current Workout:
{{#each currentWorkout}}
  - Exercise: {{exerciseName}}
  {{#each sets}}
    - Sets: {{reps}} reps at {{weight}} weight
  {{/each}}
{{/each}}

Historical Performance:
{{#each historicalPerformance}}
  - Date: {{date}}
  - Exercise: {{exerciseName}}
  {{#each sets}}
    - Sets: {{reps}} reps at {{weight}} weight
  {{/each}}
{{/each}}

Fitness Goal: {{fitnessGoal}}

Based on this information, suggest three exercises the user should consider including next workout. Only respond with the names of the suggested exercises.
Suggestions:`,
});

const suggestedExercisesFlow = ai.defineFlow(
  {
    name: 'suggestExercisesFlow',
    inputSchema: SuggestedExercisesInputSchema,
    outputSchema: SuggestedExercisesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
