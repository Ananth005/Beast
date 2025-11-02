
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { Payment, Member } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberWithPaymentInfo } from '@/app/(main)/payments/page';

interface MemberPaymentsTableProps {
  membersWithPayments: MemberWithPaymentInfo[];
  reminderMessageTemplate: string;
  onEditPayment: (member: MemberWithPaymentInfo) => void;
}

export function MemberPaymentsTable({
  membersWithPayments,
  reminderMessageTemplate,
  onEditPayment,
}: MemberPaymentsTableProps) {
  
  const handleSendReminder = (e: React.MouseEvent, member: Member, payment: Payment | undefined) => {
    e.stopPropagation(); // Prevent the row's onClick from firing
    if (!payment) {
        alert("This member doesn't have a payment record to send a reminder for.");
        return;
    }
    if (member && member.mobileNumber) {
      const message = reminderMessageTemplate
        .replace('{name}', member.name)
        .replace('{amount}', `₹${payment.amount}`)
        .replace('{dueDate}', format(parseISO(payment.dueDate), 'MMMM d, yyyy'));
        
      const whatsappUrl = `https://wa.me/${member.mobileNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Member mobile number not found.');
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead className="hidden md:table-cell">Plan</TableHead>
            <TableHead className="hidden lg:table-cell">Balance</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead>Reminder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membersWithPayments.length > 0 ? (
            membersWithPayments.map((member) => (
              <TableRow key={member.id} onClick={() => onEditPayment(member)} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member?.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground hidden md:block">
                          {member.email}
                        </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col gap-1 items-start">
                    <Badge
                      variant="outline"
                      className={cn(
                        'w-fit',
                        member.paymentStatus === 'paid' &&
                          'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
                        member.paymentStatus === 'pending' &&
                          'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
                        member.paymentStatus === 'overdue' &&
                          'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
                        member.paymentStatus === 'N/A' && 'border-gray-500/50 bg-gray-500/10 text-gray-500'
                      )}
                    >
                      {member.paymentStatus}
                    </Badge>
                     <span className="text-xs font-mono md:hidden">
                        ₹{member.balance.toFixed(2)}
                    </span>
                   </div>
                </TableCell>
                 <TableCell className="hidden md:table-cell">
                    {member.planName}
                </TableCell>
                <TableCell className="hidden lg:table-cell font-medium">
                  ₹{member.balance.toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {member.lastPayment
                    ? format(parseISO(member.lastPayment.dueDate), 'MMMM d, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                   {member.lastPayment && (member.paymentStatus === 'pending' || member.paymentStatus === 'overdue') ? (
                        <Button variant="outline" size="sm" onClick={(e) => handleSendReminder(e, member, member.lastPayment)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Send</span>
                        </Button>
                    ) : null}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No members found for the selected filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
