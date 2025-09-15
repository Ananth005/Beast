
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  BarChart3,
  User,
  Settings,
  Dumbbell,
  Users,
  CreditCard,
  ClipboardCheck,
  Trophy,
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Icons } from '../icons';

const userNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

const ownerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/check-in', label: 'Check-in', icon: ClipboardCheck },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { userRole } = useAuth();
  const navItems = userRole === 'user' ? userNavItems : ownerNavItems;

  return (
    <Sidebar side="left">
        <SidebarContent>
            <SidebarHeader>
                 <Link href="/dashboard" className="flex items-center gap-3 p-2">
                    <Icons.logo className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold tracking-tight">
                        BeastMode
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarMenu>
                {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                            <Link href={item.href}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
                })}
            </SidebarMenu>
        </SidebarContent>
    </Sidebar>
  );
}
