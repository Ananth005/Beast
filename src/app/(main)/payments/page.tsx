'use client';

import { useState, useEffect } from 'react';
import { Payment, Plan } from '@/lib/types';
import { PaymentsTable } from '@/components/payments/payments-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListFilter, Loader2 } from 'lucide-react';
import {
  getPayments,
  updatePayment,
} from '@/lib/services/payment-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PlanManagement } from '@/components/payments/plan-management';
import { getPlans, addPlan, updatePlan, deletePlan } from '@/lib/services/plan-service';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedPayments, fetchedPlans] = await Promise.all([
          getPayments(),
          getPlans(),
        ]);
        setPayments(fetchedPayments);
        setPlans(fetchedPlans);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleUpdatePayment = async (updatedPayment: Payment) => {
    try {
      await updatePayment(updatedPayment.id, updatedPayment);
      setPayments(
        payments.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
      );
      toast({
        title: 'Payment Updated',
        description: 'Payment status has been successfully updated.',
      });
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Failed to update payment.',
        variant: 'destructive',
      });
    }
  };

  const handleAddPlan = async (newPlanData: Omit<Plan, 'id'>) => {
    try {
      const newPlan = await addPlan(newPlanData);
      setPlans([newPlan, ...plans]);
      toast({
        title: 'Plan Added',
        description: `${newPlan.name} has been successfully added.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add plan.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePlan = async (updatedPlan: Plan) => {
    try {
      await updatePlan(updatedPlan.id, updatedPlan);
      setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      toast({
        title: 'Plan Updated',
        description: 'Plan details have been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update plan.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeletePlan = async (planId: string) => {
    const originalPlans = [...plans];
    setPlans(plans.filter((p) => p.id !== planId));
    try {
      await deletePlan(planId);
      toast({
        title: 'Plan Deleted',
        description: 'The plan has been successfully deleted.',
      });
    } catch (error) {
      setPlans(originalPlans);
      toast({
        title: 'Error',
        description: 'Failed to delete plan.',
        variant: 'destructive',
      });
    }
  };


  const filteredPayments = payments.filter((payment) => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Payments & Plans
      </h1>

      <PlanManagement 
        plans={plans}
        onAdd={handleAddPlan}
        onEdit={handleUpdatePlan}
        onDelete={handleDeletePlan}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-headline text-2xl font-bold tracking-tight">
          Member Payments
        </h2>
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
         <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <PaymentsTable
          payments={filteredPayments}
          onUpdatePayment={handleUpdatePayment}
        />
      )}
    </div>
  );
}
