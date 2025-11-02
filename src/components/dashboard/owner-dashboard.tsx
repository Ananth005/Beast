
'use client';

import { useState, useEffect } from 'react';
import { StatCard } from './stat-card';
import { Users, IndianRupee, UserCheck, UserPlus } from 'lucide-react';
import { getMembers } from '@/lib/services/member-service';
import { getPayments } from '@/lib/services/payment-service';
import { Member, Payment } from '@/lib/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, startOfYear, endOfYear, getYear, getMonth, setYear, setMonth } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const generateYearOptions = () => {
    const currentYear = getYear(new Date());
    const years = [];
    for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);
    }
    return years;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  const yearOptions = generateYearOptions();
  const [selectedYear, setSelectedYear] = useState<number>(getYear(new Date()));
  const [selectedMonth, setSelectedMonth] = useState<string>((getMonth(new Date())).toString());

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

  let interval: { start: Date; end: Date; };
  let description: string;
  const displayDate = setYear(new Date(), selectedYear);

  if (selectedMonth === 'all-year') {
    interval = { start: startOfYear(displayDate), end: endOfYear(displayDate) };
    description = `In ${selectedYear}`;
  } else {
    const monthIndex = parseInt(selectedMonth, 10);
    const dateWithMonth = setMonth(displayDate, monthIndex);
    interval = { start: startOfMonth(dateWithMonth), end: endOfMonth(dateWithMonth) };
    description = format(dateWithMonth, 'MMMM yyyy');
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
        <div className="flex gap-2">
           <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-year">All Year</SelectItem>
                {monthNames.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                        {month}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(year) => setSelectedYear(parseInt(year, 10))}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
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
