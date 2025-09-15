'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { IndianRupee } from 'lucide-react';

interface MemberPaymentHistoryProps {
  payments: Payment[];
}

export function MemberPaymentHistory({ payments }: MemberPaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5"/>
            <span>Payment History</span>
        </CardTitle>
        <CardDescription>
          A record of all payments for this member.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {format(parseISO(payment.dueDate), 'MMMM d, yyyy')}
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
                      {payment.paidDate
                        ? format(parseISO(payment.paidDate), 'MMMM d, yyyy')
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No payment history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
