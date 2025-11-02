
'use client';

import { useState, useEffect } from 'react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MessageSquareQuote } from 'lucide-react';

const reminderSchema = z.object({
  message: z.string().min(1, 'Reminder message cannot be empty.'),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface ReminderMessageSettingsProps {
  initialMessage: string;
  onSave: (message: string) => Promise<void>;
}

export function ReminderMessageSettings({ initialMessage, onSave }: ReminderMessageSettingsProps) {
  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
        message: initialMessage
    }
  });

  useEffect(() => {
    form.reset({ message: initialMessage });
  }, [initialMessage, form]);


  const onSubmit = (data: ReminderFormData) => {
    onSave(data.message);
  };
  
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-primary" />
            <span>Reminder Message</span>
        </CardTitle>
        <CardDescription>
          Customize the WhatsApp message sent for payment reminders. Use placeholders like `'{'{name}'}'`, `'{'{amount}'}'`, and `'{'{dueDate}'}'`.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Template</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your reminder message template..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Message'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
