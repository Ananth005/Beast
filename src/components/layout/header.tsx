'use client';

import { useRole } from '@/contexts/role-context';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { role, isMounted } = useRole();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <Icons.logo className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">BeastMode</span>
      </div>
      
      <div className="flex items-center gap-4">
        {isMounted && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
                Logged in as <span className="font-bold text-primary">{role}</span>
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
                <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
