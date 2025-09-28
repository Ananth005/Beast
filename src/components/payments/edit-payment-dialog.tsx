
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
import { MemberWithPaymentInfo } from '@/app/(main)/payments/page';
import { Plan, Payment } from '@/lib/types';
import { format } from 'date-fns';

const paymentSchema = z.object({
  planId: z.string().min(1, 'Please select a plan.'),
  status: z.enum(['paid', 'pending', 'overdue', 'N/A']),
  amount: z.coerce.number().min(0, 'Amount cannot be negative.'),
  dueDate: z.string().min(1, 'Due date is required.'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface EditPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (memberId: string, paymentData: Partial<Payment>) => void;
  member: MemberWithPaymentInfo | null;
  plans: Plan[];
}

export function EditPaymentDialog({ isOpen, onOpenChange, onSave, member, plans }: EditPaymentDialogProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  useEffect(() => {
    if (isOpen && member) {
        const defaultPlan = plans.find(p => p.id === member.lastPayment?.planId) || plans[0];
        form.reset({
            planId: member.lastPayment?.planId || defaultPlan?.id || '',
            status: member.lastPayment?.status || 'pending',
            amount: member.lastPayment?.amount || defaultPlan?.price || 0,
            dueDate: member.lastPayment?.dueDate ? format(new Date(member.lastPayment.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        });
    }
  }, [member, plans, form, isOpen]);
  
  // When plan changes, update amount and due date
  const selectedPlanId = form.watch('planId');
  useEffect(() => {
    if (selectedPlanId) {
        const plan = plans.find(p => p.id === selectedPlanId);
        if (plan) {
            form.setValue('amount', plan.price);
            const newDueDate = new Date();
            newDueDate.setDate(newDueDate.getDate() + plan.duration);
            form.setValue('dueDate', format(newDueDate, 'yyyy-MM-dd'));
        }
    }
  }, [selectedPlanId, plans, form]);


  const onSubmit = (data: PaymentFormData) => {
    if (!member) return;
    
    const paymentData: Partial<Payment> = {
        id: member.lastPayment?.id, // Pass existing id to update, or it will be undefined to create
        planId: data.planId,
        status: data.status,
        amount: data.amount,
        dueDate: new Date(data.dueDate).toISOString(),
        paidDate: data.status === 'paid' ? new Date().toISOString() : member.lastPayment?.paidDate || undefined,
    };
    onSave(member.id, paymentData);
    onOpenChange(false);
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment for {member.name}</DialogTitle>
          <DialogDescription>
            Update the payment status, plan, and details for this member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} ({plan.duration} days)
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
