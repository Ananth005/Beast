
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LeaderboardRecord, Member } from '@/lib/types';

const recordSchema = z.object({
  memberId: z.string().min(1, { message: 'Please select a member.' }),
  score: z.string().min(1, { message: 'Score cannot be empty.' }),
});

type RecordFormData = z.infer<typeof recordSchema>;

interface AddEditRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: RecordFormData) => void;
  record: LeaderboardRecord | null;
  members: Member[];
}

export function AddEditRecordDialog({ isOpen, onOpenChange, onSave, record, members }: AddEditRecordDialogProps) {
  const form = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        memberId: record?.memberId || '',
        score: record?.score || '',
      });
    }
  }, [record, members, form, isOpen]);

  const onSubmit = (data: RecordFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  const isEditing = !!record;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Record' : 'Add New Record'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this record.' : 'Add a new record to the leaderboard.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                     <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a member" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {members.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                                {member.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score / Record</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 100 kg or 5:45" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Record'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
