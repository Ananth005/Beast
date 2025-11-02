
'use client';

import { useState, useEffect } from 'react';
import { StatCard } from './stat-card';
import { Users, IndianRupee, UserCheck, UserPlus } from 'lucide-react';
import { getMembers } from '@/lib/services/member-service';
import { getPayments } from '@/lib/services/payment-service';
import { Member, Payment } from '@/lib/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, startOfYear, endOfYear, getYear, getMonth } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const generateMonthOptions = () => {
    const options = [{ label: 'All Year', value: 'all-year' }];
    const currentYear = getYear(new Date());
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, i);
        options.push({
            label: format(date, 'MMMM yyyy'),
            value: format(date, 'yyyy-MM'),
        });
    }
    return options;
};


export function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const monthOptions = generateMonthOptions();
  const currentMonthValue = format(new Date(), 'yyyy-MM');
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);

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

  let interval;
  let description;

  if (selectedMonth === 'all-year') {
    const now = new Date();
    interval = { start: startOfYear(now), end: endOfYear(now) };
    description = `In ${getYear(now)}`;
  } else {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    interval = { start: startOfMonth(date), end: endOfMonth(date) };
    description = format(date, 'MMMM yyyy');
  }

  // Filter data for the selected interval
  const paymentsInInterval = payments.filter(p => p.paidDate && isWithinInterval(parseISO(p.paidDate), interval));
  const newMembersInInterval = members.filter(m => isWithinInterval(parseISO(m.joinDate), interval));
  
  const pendingPaymentsInInterval = payments.filter(p => {
    const dueDate = parseISO(p.dueDate);
    return (p.status === 'pending' || p.status === 'overdue') && isWithinInterval(dueDate, interval);
  });

  // Calculate stats
  const totalRevenue = paymentsInInterval.reduce((acc, p) => acc + p.amount, 0);
  const feesBalance = pendingPaymentsInInterval.reduce((acc, p) => acc + p.amount, 0);
  
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
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          description={description}
        />
        <StatCard
          title="Fees Outstanding"
          value={`₹${feesBalance.toLocaleString()}`}
          icon={UserCheck}
          description={`For ${description}`}
        />
        <StatCard
          title="New Members"
          value={`+${newMembersInInterval.length}`}
          icon={UserPlus}
          description={description}
        />
      </div>
    </div>
  );
}
