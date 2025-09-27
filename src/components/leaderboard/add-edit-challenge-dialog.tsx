
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Challenge } from '@/lib/types';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { format, addDays, parseISO } from 'date-fns';
import { useEffect } from 'react';

const challengeSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface AddEditChallengeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveChallenge: (challenge: Omit<Challenge, 'id' | 'participantCount'> | Challenge) => void;
  challenge: Challenge | null;
}

export function AddEditChallengeDialog({ isOpen, onOpenChange, onSaveChallenge, challenge }: AddEditChallengeDialogProps) {
  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (challenge) {
        form.reset({
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          endDate: format(parseISO(challenge.endDate), 'yyyy-MM-dd'),
        });
      } else {
        form.reset({
          title: '',
          description: '',
          category: 'Fitness',
          endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        });
      }
    }
  }, [challenge, form, isOpen]);


  const onSubmit = (data: ChallengeFormData) => {
    const challengeData = { ...data, endDate: new Date(data.endDate).toISOString() };
    if (challenge) {
      onSaveChallenge({ ...challenge, ...challengeData });
    } else {
      onSaveChallenge(challengeData);
    }
    onOpenChange(false);
  };

  const isEditing = !!challenge;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Challenge' : 'Create New Challenge'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this challenge.' : 'Set up a new challenge for gym members to compete in.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Shred" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the challenge goals and rules." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Strength, Cardio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create Challenge'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
