
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


export function Header() {
  const { user, userRole, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <Icons.logo className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">BeastMode</span>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center space-x-2">
             <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                <AvatarFallback>{user.displayName?.charAt(0) ?? user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-col hidden sm:flex">
                 <span className="text-sm font-medium">
                    {user.displayName}
                </span>
                <span className="text-xs text-muted-foreground">
                    Logged in as <span className="font-bold text-primary">{userRole}</span>
                </span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
                <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
