'use client';

import { useRole } from '@/contexts/role-context';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/icons';

export function Header() {
  const { role, toggleRole, isMounted } = useRole();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <Icons.logo className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">BeastMode</span>
      </div>
      <div className="hidden flex-1 md:block" />
      <div className="flex items-center gap-4">
        {isMounted && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="role-switch" className={role === 'user' ? 'text-primary font-bold' : ''}>
              User
            </Label>
            <Switch
              id="role-switch"
              checked={role === 'owner'}
              onCheckedChange={toggleRole}
              aria-label="Toggle between user and owner mode"
            />
            <Label htmlFor="role-switch" className={role === 'owner' ? 'text-primary font-bold' : ''}>
              Owner
            </Label>
          </div>
        )}
      </div>
    </header>
  );
}
