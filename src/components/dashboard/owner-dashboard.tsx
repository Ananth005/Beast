
'use client';

import { useState, useEffect } from 'react';
import { StatCard } from './stat-card';
import { Users, TrendingUp, IndianRupee, UserCheck, UserPlus, Calendar as CalendarIcon } from 'lucide-react';
import { getMembers } from '@/lib/services/member-service';
import { getPayments } from '@/lib/services/payment-service';
import { Member, Payment } from '@/lib/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';

export function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [fetchedMembers, fetchedPayments] = await Promise.all([
        getMembers(),
        getPayments(),
      ]);
      setMembers(fetchedMembers);
      setPayments(fetchedPayments);
      setLoading(false);
    };
    fetchData();
  }, []);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  // Filter data for the selected month
  const paymentsInMonth = payments.filter(p => p.paidDate && isWithinInterval(parseISO(p.paidDate), { start: monthStart, end: monthEnd }));
  const newMembersInMonth = members.filter(m => isWithinInterval(parseISO(m.joinDate), { start: monthStart, end: monthEnd }));
  
  const pendingPaymentsInMonth = payments.filter(p => {
    const dueDate = parseISO(p.dueDate);
    return (p.status === 'pending' || p.status === 'overdue') && isWithinInterval(dueDate, { start: monthStart, end: monthEnd });
  });

  // Calculate stats
  const totalRevenueThisMonth = paymentsInMonth.reduce((acc, p) => acc + p.amount, 0);
  const feesBalanceThisMonth = pendingPaymentsInMonth.reduce((acc, p) => acc + p.amount, 0);
  
  const activeMembers = members.filter(m => m.membershipStatus === 'active');
  const totalMaleMembers = activeMembers.filter(m => m.gender === 'male').length;
  const totalFemaleMembers = activeMembers.filter(m => m.gender === 'female').length;

  if (loading) {
      return (
          <div className="flex flex-col gap-6">
              <Skeleton className="h-10 w-1/2" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Business Dashboard
        </h1>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal md:w-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'MMMM yyyy')}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(day) => day && setSelectedDate(day)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Members"
          value={activeMembers.length.toString()}
          icon={Users}
          description={`${totalMaleMembers} Male, ${totalFemaleMembers} Female`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${totalRevenueThisMonth.toLocaleString()}`}
          icon={IndianRupee}
          description={format(selectedDate, 'MMMM yyyy')}
        />
        <StatCard
          title="Fees Outstanding"
          value={`₹${feesBalanceThisMonth.toLocaleString()}`}
          icon={UserCheck}
          description={`For ${format(selectedDate, 'MMMM yyyy')}`}
        />
        <StatCard
          title="New Members"
          value={`+${newMembersInMonth.length}`}
          icon={UserPlus}
          description={`In ${format(selectedDate, 'MMMM yyyy')}`}
        />
      </div>
    </div>
  );
}
