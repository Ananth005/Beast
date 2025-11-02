
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Payment, Plan, Member } from '@/lib/types';
import { MemberPaymentsTable } from '@/components/payments/member-payments-table';
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
  addPayment,
} from '@/lib/services/payment-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlans } from '@/lib/services/plan-service';
import { useAuth } from '@/contexts/auth-context';
import { getMembers } from '@/lib/services/member-service';
import { EditPaymentDialog } from '@/components/payments/edit-payment-dialog';
import { differenceInMonths, isBefore, isPast } from 'date-fns';
import { getReminderMessage } from '@/lib/services/setting-service';

export type MemberWithPaymentInfo = Member & {
  paymentStatus: string;
  lastPayment?: Payment;
  planName: string;
  balance: number;
};

export default function PaymentsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberWithPaymentInfo | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { toast } = useToast();
  const { userRole } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedMembers, fetchedPayments, fetchedPlans, fetchedMessage] = await Promise.all([
        getMembers(),
        getPayments(),
        getPlans(),
        getReminderMessage()
      ]);
      setMembers(fetchedMembers);
      setPayments(fetchedPayments);
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

  const handleEditPayment = (member: MemberWithPaymentInfo) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdatePaymentAndPlan = async (
    memberId: string,
    paymentData: Partial<Payment>
  ) => {
    try {
      if (paymentData.id) {
        // If a payment exists, update it
        await updatePayment(paymentData.id, paymentData);
      } else {
        // If no payment exists, create one
        await addPayment({
            memberId: memberId,
            name: members.find(m => m.id === memberId)?.name || 'N/A',
            ...paymentData
        });
      }
      await fetchData(); // Refetch data
      toast({
        title: 'Payment Updated',
        description: 'Payment details have been successfully updated.',
      });
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Failed to update payment.',
        variant: 'destructive',
      });
    }
  };

  const membersWithPayments = useMemo(() => members.map((member): MemberWithPaymentInfo => {
    const memberPayments = payments
      .filter(p => p.memberId === member.id)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    
    const lastPayment = memberPayments[0];
    const plan = plans.find(p => p.id === lastPayment?.planId);
    
    let balance = 0;
    let paymentStatus = lastPayment?.status || 'N/A';

    if (lastPayment && isPast(new Date(lastPayment.dueDate)) && paymentStatus === 'pending') {
        paymentStatus = 'overdue';
    }
    
    if (plan && lastPayment && (paymentStatus === 'pending' || paymentStatus === 'overdue')) {
        const dueDate = new Date(lastPayment.dueDate);
        const today = new Date();
        
        if (isBefore(dueDate, today)) {
             const monthsDiff = differenceInMonths(today, dueDate);
             const cyclesMissed = Math.floor(monthsDiff / plan.duration) + 1;
             balance = cyclesMissed * plan.price;
        } else {
            balance = plan.price;
        }
    }


    return {
      ...member,
      paymentStatus,
      lastPayment: lastPayment,
      planName: plan?.name || 'N/A',
      balance,
    };
  }).filter(member => {
    if (filter === 'all') return true;
    return member.paymentStatus === filter;
  }), [members, payments, plans, filter]);

  const paginatedMembers = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return membersWithPayments.slice(start, end);
  }, [membersWithPayments, pageIndex, pageSize]);

  return (
    <>
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Member Payments
        </h1>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                <SelectItem value="N/A">No Payments</SelectItem>
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
          <MemberPaymentsTable
            membersWithPayments={paginatedMembers}
            reminderMessageTemplate={reminderMessage}
            onEditPayment={handleEditPayment}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalRows={membersWithPayments.length}
          />
        )}
      </div>

      {editingMember && (
        <EditPaymentDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            member={editingMember}
            plans={plans}
            onSave={handleUpdatePaymentAndPlan}
        />
      )}
    </>
  );
}
