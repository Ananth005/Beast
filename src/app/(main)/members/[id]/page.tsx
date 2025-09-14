'use client';

import { useParams } from 'next/navigation';
import { members, payments as allPayments } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, CheckCircle, AlertTriangle, Clock, Phone } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { MemberPaymentHistory } from '@/components/members/member-payment-history';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function MemberDetailPage() {
  const params = useParams();
  const memberId = params.id as string;

  const member = members.find((m) => m.id === memberId);
  const memberPayments = allPayments.filter((p) => p.memberId === memberId);

  if (!member) {
    return (
      <div className="space-y-6">
         <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/members"><ArrowLeft /></Link>
          </Button>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Member not found
          </h1>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/members"><ArrowLeft /></Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Member Details
        </h1>
      </div>
      <Card>
        <CardHeader className="flex flex-col items-center text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-6">
            <CardTitle>{member.name}</CardTitle>
            <CardDescription className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail className="h-4 w-4"/> {member.email}
            </CardDescription>
             <CardDescription className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Phone className="h-4 w-4"/> {member.mobileNumber}
            </CardDescription>
             <Badge
              variant="outline"
              className={cn('mt-2',
                member.membershipStatus === 'active' &&
                  'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
                member.membershipStatus === 'inactive' &&
                  'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
                member.membershipStatus === 'frozen' &&
                  'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400'
              )}
            >
              {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {format(parseISO(member.joinDate), 'MMMM d, yyyy')}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Last Visit: {format(parseISO(member.lastVisit), 'MMMM d, yyyy')}</span>
                </div>
                 <div className="flex items-center gap-2">
                    {memberPayments.some(p => p.status === 'overdue') ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <Clock className="h-4 w-4" />}
                    <span>Payment Status: {memberPayments.some(p => p.status === 'overdue') ? <span className="text-destructive font-semibold">Overdue</span> : 'Up to date'}</span>
                </div>
            </div>
        </CardContent>
      </Card>

      <MemberPaymentHistory payments={memberPayments} />
    </div>
  );
}
