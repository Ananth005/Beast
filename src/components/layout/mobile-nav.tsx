'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/contexts/role-context';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  Dumbbell,
  Users,
  CreditCard,
  Trophy,
  User,
} from 'lucide-react';

const userNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/leaderboard', label: 'Leaders', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

const ownerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/leaderboard', label: 'Leaders', icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();
  const { role } = useRole();
  const navItems = role === 'user' ? userNavItems : ownerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm md:hidden">
      <div className={cn("grid h-16", role === 'user' ? "grid-cols-5" : "grid-cols-4")}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground',
                isActive && 'text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
