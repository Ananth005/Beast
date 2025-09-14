
'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle, Save } from 'lucide-react';
import { exercises as allExercises, currentWorkout as initialWorkout } from '@/lib/mock-data';
import { WorkoutExercise } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const setSchema = z.object({
  reps: z.coerce.number().min(1, 'Reps must be at least 1'),
  weight: z.coerce.number().min(0, 'Weight cannot be negative'),
});

const workoutExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string().min(1, 'Please select an exercise.'),
  sets: z.array(setSchema).min(1, 'Add at least one set.'),
});

const workoutFormSchema = z.object({
  exercises: z.array(workoutExerciseSchema),
});

type WorkoutFormData = z.infer<typeof workoutFormSchema>;

export function WorkoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      exercises: initialWorkout.map(e => ({...e, exerciseName: undefined})),
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const onSubmit = (data: WorkoutFormData) => {
    setIsSubmitting(true);
    console.log('Workout data:', data);
    // Here you would typically send the data to your backend
    setTimeout(() => {
      toast({
        title: 'Workout Saved!',
        description: 'Your workout has been successfully logged.',
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  const addExercise = () => {
    append({ id: uuidv4(), exerciseId: '', sets: [{ reps: 8, weight: 0 }] });
  };
  
  const addSet = (exerciseIndex: number) => {
    const currentSets = form.getValues(`exercises.${exerciseIndex}.sets`);
    const lastSet = currentSets[currentSets.length - 1] ?? { reps: 8, weight: 0 };
    const newSets = [...currentSets, lastSet];
    update(exerciseIndex, { ...form.getValues(`exercises.${exerciseIndex}`), sets: newSets });
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const currentSets = form.getValues(`exercises.${exerciseIndex}.sets`);
    if (currentSets.length > 1) {
      const newSets = currentSets.filter((_, i) => i !== setIndex);
      update(exerciseIndex, { ...form.getValues(`exercises.${exerciseIndex}`), sets: newSets });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => {
          const selectedExercise = allExercises.find(ex => ex.id === form.watch(`exercises.${index}.exerciseId`));
          return (
          <Card key={field.id}>
            <CardHeader className='flex-row items-center justify-between'>
              <CardTitle>
                {selectedExercise ? selectedExercise.name : 'New Exercise'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`exercises.${index}.exerciseId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an exercise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allExercises.map((exercise) => (
                          <SelectItem key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Sets</FormLabel>
                {form.getValues(`exercises.${index}.sets`).map((_, setIndex) => (
                   <div key={setIndex} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.sets.${setIndex}.weight`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input type="number" placeholder="Weight" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <span className="text-muted-foreground">lbs</span>
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.sets.${setIndex}.reps`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input type="number" placeholder="Reps" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-muted-foreground">reps</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet(index, setIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addSet(index)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Set
                </Button>
              </div>

            </CardContent>
          </Card>
        )})}

        <Button type="button" variant="secondary" onClick={addExercise} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Another Exercise
        </Button>
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Workout'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
