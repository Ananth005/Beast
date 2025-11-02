
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Clock } from 'lucide-react';
import { Payment, Member } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberWithPaymentInfo } from '@/app/(main)/payments/page';

interface MemberPaymentsTableProps {
  membersWithPayments: MemberWithPaymentInfo[];
  onEditPayment: (member: MemberWithPaymentInfo) => void;
}

export function MemberPaymentsTable({
  membersWithPayments,
  onEditPayment,
}: MemberPaymentsTableProps) {
  
  const handleSendReminder = (member: Member, payment: Payment | undefined) => {
    if (!payment) {
        alert("This member doesn't have a payment record to send a reminder for.");
        return;
    }
    if (member && member.mobileNumber) {
      const message = `Hi ${member.name}, this is a friendly reminder that your payment of ₹${payment.amount} is due on ${format(parseISO(payment.dueDate), 'MMMM d, yyyy')}.`;
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
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="hidden lg:table-cell">Balance</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membersWithPayments.length > 0 ? (
            membersWithPayments.map((member) => {
              const balance = (member.paymentStatus === 'pending' || member.paymentStatus === 'overdue') && member.lastPayment
                ? member.lastPayment.amount 
                : 0;

              return (
              <TableRow key={member.id}>
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
                  <Badge
                    variant="outline"
                    className={cn(
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
                </TableCell>
                 <TableCell className="hidden md:table-cell">
                    {member.planName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {member.lastPayment
                    ? format(parseISO(member.lastPayment.dueDate), 'MMMM d, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell className={cn("hidden lg:table-cell font-medium", balance > 0 && "text-destructive")}>
                  ₹{balance.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onSelect={() => onEditPayment(member)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Payment/Plan
                          </DropdownMenuItem>
                        {member.lastPayment && (
                          <DropdownMenuItem onSelect={() => handleSendReminder(member, member.lastPayment)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                   </div>
                </TableCell>
              </TableRow>
            )})
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No members found for the selected filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
