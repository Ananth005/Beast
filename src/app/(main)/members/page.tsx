
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { MembersTable } from '@/components/members/members-table';
import { Member, Payment, Plan } from '@/lib/types';
import { AddMemberDialog } from '@/components/members/add-member-dialog';
import { getMembers, addMember as addMemberService, updateMember as updateMemberService, deleteMember as deleteMemberService } from '@/lib/services/member-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getPayments } from '@/lib/services/payment-service';
import { getPlans } from '@/lib/services/plan-service';
import { addPayment } from '@/lib/services/payment-service';
import { addMonths, formatISO } from 'date-fns';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { toast } = useToast();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [fetchedMembers, fetchedPayments, fetchedPlans] = await Promise.all([
        getMembers(),
        getPayments(),
        getPlans(),
      ]);
      const sortedMembers = fetchedMembers.sort((a, b) => a.name.localeCompare(b.name));
      setMembers(sortedMembers);
      setPayments(fetchedPayments);
      setPlans(fetchedPlans);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error fetching data',
        description: 'Could not load data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredMembers = useMemo(() => members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [members, searchTerm]);

  const handleAddMember = async (newMemberData: Omit<Member, 'id' | 'lastVisit' | 'avatarUrl'> & { planId: string, paymentStatus: 'paid' | 'pending' }) => {
    try {
      const newMember = await addMemberService(newMemberData);
      const selectedPlan = plans.find(p => p.id === newMemberData.planId);
      
      if (selectedPlan) {
        const dueDate = addMonths(new Date(), selectedPlan.duration);
        const newPayment: Omit<Payment, 'id'> = {
            memberId: newMember.id,
            name: newMember.name,
            amount: selectedPlan.price,
            dueDate: formatISO(dueDate),
            status: newMemberData.paymentStatus,
            planId: newMemberData.planId,
            paidDate: newMemberData.paymentStatus === 'paid' ? new Date().toISOString() : undefined
        };
        await addPayment(newPayment);
      }

      toast({
        title: 'Member Added',
        description: `${newMember.name} has been successfully added.`,
      });
      await fetchAllData(); // Refresh all data
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add member.',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateMember = async (updatedMember: Member) => {
    try {
      await updateMemberService(updatedMember.id, updatedMember);
      toast({
        title: 'Member Updated',
        description: 'Member details have been successfully updated.',
      });
      await fetchAllData(); // Refresh all data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteMemberService(memberId);
      toast({
        title: 'Member Deleted',
        description: 'The member has been successfully deleted.',
      });
      await fetchAllData(); // Refresh all data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete member.',
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Member Management
        </h1>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="w-full pl-9 md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddMemberOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add a Member
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <MembersTable 
            members={filteredMembers} 
            payments={payments}
            plans={plans}
            onEdit={handleUpdateMember} 
            onDelete={handleDeleteMember}
        />
      )}

      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
        plans={plans}
      />
    </div>
  );
}
