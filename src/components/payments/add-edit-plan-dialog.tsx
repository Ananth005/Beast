
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plan } from '@/lib/types';

const planSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters.'),
  duration: z.coerce.number().int().min(1).max(12, 'Duration must be between 1 and 12 months.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
});

type PlanFormData = z.infer<typeof planSchema>;

interface AddEditPlanDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (plan: Omit<Plan, 'id'> | Plan) => void;
  plan: Plan | null;
}

export function AddEditPlanDialog({ isOpen, onOpenChange, onSave, plan }: AddEditPlanDialogProps) {
  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
      });
    } else {
      form.reset({
        name: '',
        duration: 1,
        price: 0,
      });
    }
  }, [plan, form, isOpen]);

  const onSubmit = (data: PlanFormData) => {
    if (plan) {
      onSave({ ...plan, ...data });
    } else {
      onSave(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
          <DialogDescription>
            {plan ? `Update the details for the ${plan.name} plan.` : 'Enter the details for the new membership plan.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monthly, Quarterly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (in months)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <SelectItem key={month} value={String(month)}>
                          {month} Month{month > 1 ? 's' : ''}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Plan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
