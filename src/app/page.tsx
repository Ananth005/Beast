
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { User, Shield, Chrome } from 'lucide-react';
import  DarkVeil  from '@/components/DarkVeil';
import { Loader } from '@/components/ui/loader';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginAsRole, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background">
            <Loader />
        </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <DarkVeil speed={3} hueShift={240}/>
        {/* <Image
          src="https://picsum.photos/seed/beastmode/1920/1080"
          alt="Background gym"
          fill
          className="object-cover opacity-20 hue-rotate-animation"
          style={{ animationDuration: '20s' }}
          data-ai-hint="gym background"
          priority
        /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" /> */}
      </div>
      <div className="relative z-10 flex flex-col items-center space-y-4 px-4 text-center sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Icons.logo className="h-12 w-12 text-primary sm:h-16 sm:w-16" />
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-foreground sm:text-7xl">
            BeastMode
          </h1>
        </div>
        <p className="max-w-md text-base text-muted-foreground sm:text-lg">
          Hey, Boss lets get into beast mode
        </p>
        
        <div className="flex w-full max-w-xs flex-col gap-4">
          <Button onClick={loginWithGoogle} size="lg" disabled={loading} variant="outline">
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
           {/* <p className="text-xs text-muted-foreground">Or use a mock account for testing:</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button onClick={() => loginAsRole('user')} size="lg" disabled={loading} className="flex-1">
              <User className="mr-2 h-5 w-5" />
              Login as User
            </Button>
            <Button onClick={() => loginAsRole('owner')} size="lg" variant="secondary" disabled={loading} className="flex-1">
              <Shield className="mr-2 h-5 w-5" />
              Login as Owner
            </Button>
          </div> */}
        </div>

      </div>
      <footer className="absolute bottom-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BeastMode. All rights reserved.</p>
      </footer>
    </div>
  );
}
