'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Megaphone } from 'lucide-react';
import { addDays, formatISO } from 'date-fns';

const announcementSchema = z.object({
  message: z.string().min(10, 'Announcement message must be at least 10 characters.').max(280, 'Announcement must be less than 280 characters.'),
  duration: z.enum(['day', 'week', 'month']),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export function CreateAnnouncement() {
  const { toast } = useToast();
  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      message: '',
      duration: 'week',
    },
  });

  const onSubmit = (data: AnnouncementFormData) => {
    let expiryDate: Date;
    const now = new Date();
    switch (data.duration) {
      case 'day':
        expiryDate = addDays(now, 1);
        break;
      case 'week':
        expiryDate = addDays(now, 7);
        break;
      case 'month':
        expiryDate = addDays(now, 30);
        break;
    }
    
    // In a real app, you would send this to your backend
    console.log({
      message: data.message,
      expiry: formatISO(expiryDate),
    });

    toast({
      title: 'Announcement Posted!',
      description: 'Your announcement is now visible to all members.',
    });
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <span>Create Announcement</span>
        </CardTitle>
        <CardDescription>
          Post a notice or notification for all gym members. It will appear on their dashboard.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The gym will have reduced hours on the upcoming holiday..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Show For</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="day">1 Day</SelectItem>
                      <SelectItem value="week">1 Week</SelectItem>
                      <SelectItem value="month">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Post Announcement</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
