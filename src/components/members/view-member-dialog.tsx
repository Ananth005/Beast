'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Mail, Calendar, CheckCircle, AlertTriangle, Clock, Phone } from 'lucide-react';
// In a real app, you would fetch this data
import { payments as allPayments } from '@/lib/mock-data';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface ViewMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  member: Member | null;
}

export function ViewMemberDialog({ isOpen, onOpenChange, member }: ViewMemberDialogProps) {
  const router = useRouter();
  if (!member) return null;

  // Note: In a real app, you'd fetch payments for the specific member from your backend
  const memberPayments = allPayments.filter((p) => p.memberId === member.id);

  const handleViewFullDetails = () => {
    onOpenChange(false);
    router.push(`/members/${member.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-col items-center text-center sm:flex-row sm:text-left">
           <Avatar className="h-24 w-24">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-6">
            <DialogTitle className="text-2xl">{member.name}</DialogTitle>
             <DialogDescription className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail className="h-4 w-4"/> {member.email}
            </DialogDescription>
             <DialogDescription className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Phone className="h-4 w-4"/> {member.mobileNumber}
            </DialogDescription>
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
        </DialogHeader>
        <div className="py-4 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {format(parseISO(member.joinDate), 'MMMM d, yyyy')}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Last Visit: {format(parseISO(member.lastVisit), 'MMMM d, yyyy')}</span>
                </div>
                 <div className="flex items-center gap-2 col-span-full">
                    {memberPayments.some(p => p.status === 'overdue') ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <Clock className="h-4 w-4" />}
                    <span>Payment Status: {memberPayments.some(p => p.status === 'overdue') ? <span className="text-destructive font-semibold">Overdue</span> : 'Up to date'}</span>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleViewFullDetails}>View Full Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
