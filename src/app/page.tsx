
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, User, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginAsRole } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
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
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
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
        
        <div className="flex gap-4">
          <Button onClick={() => loginAsRole('user')} size="lg" disabled={loading}>
            <User className="mr-2 h-5 w-5" />
            Login as User
          </Button>
          <Button onClick={() => loginAsRole('owner')} size="lg" variant="secondary" disabled={loading}>
            <Shield className="mr-2 h-5 w-5" />
            Login as Owner
          </Button>
        </div>

      </div>
      <footer className="absolute bottom-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BeastMode. All rights reserved.</p>
      </footer>
    </div>
  );
}
