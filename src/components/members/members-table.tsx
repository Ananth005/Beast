
'use client';

import { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Member, Payment, Plan } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { EditMemberDialog } from './edit-member-dialog';
import { ViewMemberDialog } from './view-member-dialog';
import { useRouter } from 'next/navigation';

interface MembersTableProps {
  members: Member[];
  payments: Payment[];
  plans: Plan[];
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

export function MembersTable({ 
    members, 
    payments, 
    plans, 
    onEdit, 
    onDelete,
}: MembersTableProps) {
  const router = useRouter();
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
  };
  
  const handleDeleteClick = (memberId: string) => {
    setDeletingMemberId(memberId);
  };

  const confirmDelete = () => {
    if (deletingMemberId) {
      onDelete(deletingMemberId);
      setDeletingMemberId(null);
    }
  };
  
  const handleViewDetails = (member: Member) => {
    setViewingMember(member);
  };

  const getMemberPaymentInfo = (memberId: string) => {
    const memberPayments = payments
      .filter(p => p.memberId === memberId)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    
    if (memberPayments.length === 0) {
      return { planName: 'N/A', paymentStatus: 'N/A', nextDueDate: null };
    }

    const latestPayment = memberPayments[0];
    const plan = plans.find(p => p.id === latestPayment.planId);

    return {
      planName: plan?.name ?? 'Unknown Plan',
      paymentStatus: latestPayment.status,
      nextDueDate: latestPayment.dueDate,
    };
  };

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Payment Status</TableHead>
                <TableHead className="hidden lg:table-cell">Plan</TableHead>
                <TableHead className="hidden md:table-cell">Next Due Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => {
                  const { planName, paymentStatus, nextDueDate } = getMemberPaymentInfo(member.id);
                  return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5" onClick={() => handleViewDetails(member)}>
                          <p className="font-medium cursor-pointer hover:underline">{member.name}</p>
                          <p className="text-xs text-muted-foreground hidden md:block">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            paymentStatus === 'paid' &&
                              'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
                            paymentStatus === 'pending' &&
                              'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
                            paymentStatus === 'overdue' &&
                              'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
                          )}
                        >
                          {paymentStatus}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {planName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {nextDueDate ? format(parseISO(nextDueDate), 'MMMM d, yyyy') : 'N/A'}
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
                          <DropdownMenuItem onSelect={() => router.push(`/members/${member.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Full Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleEditClick(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDeleteClick(member.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )})
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {viewingMember && (
        <ViewMemberDialog
            isOpen={!!viewingMember}
            onOpenChange={(isOpen) => !isOpen && setViewingMember(null)}
            member={viewingMember}
        />
      )}

      {editingMember && (
        <EditMemberDialog
            isOpen={!!editingMember}
            onOpenChange={(isOpen) => !isOpen && setEditingMember(null)}
            member={editingMember}
            onUpdateMember={onEdit}
        />
      )}

      <AlertDialog open={!!deletingMemberId} onOpenChange={(open) => !open && setDeletingMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
