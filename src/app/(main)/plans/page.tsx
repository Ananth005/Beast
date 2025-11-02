
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plan } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PlanManagement } from '@/components/payments/plan-management';
import { getPlans, addPlan, updatePlan, deletePlan } from '@/lib/services/plan-service';
import { useAuth } from '@/contexts/auth-context';
import { ReminderMessageSettings } from '@/components/payments/reminder-message-settings';
import { getReminderMessage, saveReminderMessage } from '@/lib/services/setting-service';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userRole } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedPlans, fetchedMessage] = await Promise.all([
        getPlans(),
        getReminderMessage()
      ]);
      setPlans(fetchedPlans);
      setReminderMessage(fetchedMessage);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddPlan = async (newPlanData: Omit<Plan, 'id'>) => {
    try {
      await addPlan(newPlanData);
      await fetchData(); // Refetch
      toast({
        title: 'Plan Added',
        description: `${newPlanData.name} has been successfully added.`,
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
      await fetchData(); // Refetch
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
    try {
      await deletePlan(planId);
      await fetchData(); // Refetch
      toast({
        title: 'Plan Deleted',
        description: 'The plan has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete plan. Members might be associated with it.',
        variant: 'destructive',
      });
    }
  };
  
  const handleSaveReminder = async (message: string) => {
      try {
        await saveReminderMessage(message);
        setReminderMessage(message);
        toast({
            title: 'Reminder Message Saved',
            description: 'Your new reminder message has been saved.',
        });
      } catch (error) {
          toast({
              title: 'Error',
              description: 'Failed to save reminder message.',
              variant: 'destructive',
          });
      }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Plans & Reminders
      </h1>
      
      {userRole === 'owner' && (
        <div className='space-y-6'>
          <ReminderMessageSettings
              initialMessage={reminderMessage}
              onSave={handleSaveReminder}
          />
          <PlanManagement 
              plans={plans}
              onAdd={handleAddPlan}
              onEdit={handleUpdatePlan}
              onDelete={handleDeletePlan}
          />
        </div>
      )}
    </div>
  );
}
