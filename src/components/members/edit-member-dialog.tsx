'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Member } from '@/lib/types';
import { useEffect } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

const memberSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  mobileNumber: z.string().min(10, { message: 'Mobile number must be at least 10 digits.' }),
  joinDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  membershipStatus: z.enum(['active', 'inactive', 'frozen']),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface EditMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateMember: (member: Member) => void;
  member: Member | null;
}

export function EditMemberDialog({ isOpen, onOpenChange, onUpdateMember, member }: EditMemberDialogProps) {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        email: member.email,
        mobileNumber: member.mobileNumber,
        joinDate: member.joinDate.split('T')[0],
        membershipStatus: member.membershipStatus,
      });
    }
  }, [member, form]);

  const onSubmit = (data: MemberFormData) => {
    if (member) {
      onUpdateMember({ ...member, ...data, joinDate: new Date(data.joinDate).toISOString() });
      onOpenChange(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update the details for {member.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joinDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="membershipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
