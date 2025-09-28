
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LeaderboardCategory } from '@/app/(main)/leaderboard/page';

const leaderboardSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
});

type LeaderboardFormData = z.infer<typeof leaderboardSchema>;

interface AddEditLeaderboardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: LeaderboardFormData) => void;
  leaderboard: LeaderboardCategory | null;
}

export function AddEditLeaderboardDialog({ isOpen, onOpenChange, onSave, leaderboard }: AddEditLeaderboardDialogProps) {
  const form = useForm<LeaderboardFormData>({
    resolver: zodResolver(leaderboardSchema),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: leaderboard?.title || '',
      });
    }
  }, [leaderboard, form, isOpen]);

  const onSubmit = (data: LeaderboardFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  const isEditing = !!leaderboard;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Leaderboard' : 'Create New Leaderboard'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the title for this leaderboard.' : 'Create a new category for gym records.'}
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
                    <Input placeholder="e.g., Max Bench Press" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
