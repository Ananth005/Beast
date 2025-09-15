
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="hidden text-xl font-bold tracking-tight md:block">
            BeastMode
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </header>
  );
}
