
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignUpData } from '@/lib/types';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['user', 'owner'], { required_error: 'You must select a role.' }),
});

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading, signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', role: 'user' },
  });

  const handleSignUp = async (data: SignUpData) => {
    setError(null);
    try {
      await signUp(data);
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      setError(error.message || 'An unknown error occurred.');
    }
  };

  if (loading || user) {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/beastmode-signup/1920/1080"
          alt="Background gym"
          fill
          className="object-cover opacity-20"
          data-ai-hint="gym action"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
        <div className="flex items-center gap-4">
          <Icons.logo className="h-16 w-16 text-primary" />
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground">
            BeastMode
          </h1>
        </div>
        <Card className="w-full max-w-sm text-left">
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Join the BeastMode community today.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Sign-up Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" {...form.register('name')} />
                        {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')} />
                        {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...form.register('password')} />
                        {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
                    </div>
                     <div className="space-y-3">
                        <Label>I am a...</Label>
                        <RadioGroup
                            onValueChange={(value) => form.setValue('role', value as 'user' | 'owner')}
                            defaultValue={form.getValues('role')}
                            className="flex gap-4"
                        >
                            <Label htmlFor="role-user" className="flex items-center gap-2 cursor-pointer rounded-md border p-3 has-[:checked]:border-primary">
                                <RadioGroupItem value="user" id="role-user" />
                                User
                            </Label>
                            <Label htmlFor="role-owner" className="flex items-center gap-2 cursor-pointer rounded-md border p-3 has-[:checked]:border-primary">
                                <RadioGroupItem value="owner" id="role-owner" />
                                Gym Owner
                            </Label>
                        </RadioGroup>
                         {form.formState.errors.role && <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{\' \'}
                    <Link href="/" className="underline">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
