
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error during sign-in:", error);
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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/beastmode/1920/1080"
          alt="Background gym"
          fill
          className="object-cover opacity-20"
          data-ai-hint="gym background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>
      <div className="relative z-10 flex flex-col items-center space-y-8 text-center">
        <div className="flex items-center gap-4">
          <Icons.logo className="h-16 w-16 text-primary" />
          <h1 className="font-headline text-7xl font-extrabold tracking-tighter text-foreground">
            BeastMode
          </h1>
        </div>
        <p className="max-w-md text-lg text-muted-foreground">
          Unleash your potential. The ultimate platform for gym members and
          owners to track, manage, and grow.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" onClick={handleSignIn}>
            <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5c-20.5-16.2-49-26.6-80.2-26.6-62.3 0-113.5 51.2-113.5 113.5s51.2 113.5 113.5 113.5c71.2 0 98.2-53.2 102.7-77.9H248V261.8h239.2z"></path></svg>
            Sign in with Google
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BeastMode. All rights reserved.</p>
      </footer>
    </div>
  );
}
