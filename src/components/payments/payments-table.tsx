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
import { MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { Payment } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { members } from '@/lib/mock-data';

interface PaymentsTableProps {
  payments: Payment[];
  onUpdatePayment: (payment: Payment) => void;
}

export function PaymentsTable({
  payments,
  onUpdatePayment,
}: PaymentsTableProps) {
  const handleMarkAsPaid = (payment: Payment) => {
    onUpdatePayment({
      ...payment,
      status: 'paid',
      paidDate: new Date().toISOString(),
    });
  };

  const handleSendReminder = (payment: Payment) => {
    const member = members.find(m => m.id === payment.memberId);
    if (member && member.mobileNumber) {
      const message = `Hi ${member.name}, this is a friendly reminder that your payment of $${payment.amount} is due on ${format(parseISO(payment.dueDate), 'MMMM d, yyyy')}.`;
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
            <TableHead className="hidden md:table-cell">Amount</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="hidden lg:table-cell">Paid On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment) => {
              const member = members.find(m => m.id === payment.memberId);
              return (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member?.avatarUrl} alt={payment.name} />
                      <AvatarFallback>{payment.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{payment.name}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(parseISO(payment.dueDate), 'MMMM d, yyyy')}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {payment.paidDate
                    ? format(parseISO(payment.paidDate), 'MMMM d, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      payment.status === 'paid' &&
                        'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
                      payment.status === 'pending' &&
                        'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
                      payment.status === 'overdue' &&
                        'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
                    )}
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {payment.status !== 'paid' && (
                        <DropdownMenuItem
                          onSelect={() => handleMarkAsPaid(payment)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onSelect={() => handleSendReminder(payment)}>
                         <Clock className="mr-2 h-4 w-4" />
                        Send Reminder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
