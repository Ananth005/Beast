
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
  LogOut,
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { Icons } from '../icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';

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
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userRole, logout } = useAuth();
  const { isMobile, toggleSidebar } = useSidebar();
  const navItems = userRole === 'user' ? userNavItems : ownerNavItems;

  const handleLogout = async () => {
    if(isMobile) toggleSidebar();
    await logout();
    router.push('/');
  };

  return (
    <Sidebar side={isMobile ? 'right' : 'left'}>
        <SidebarContent>
            <SidebarHeader>
                 {user && (
                    <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={user.photoURL ?? undefined}
                            alt={user.displayName ?? ''}
                        />
                        <AvatarFallback>
                            {user.displayName?.charAt(0) ?? user.email?.charAt(0)}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-primary-foreground truncate">
                                {user.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
            </SidebarHeader>
            <Separator />
            <SidebarMenu className="flex-1">
                {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive} onClick={isMobile ? toggleSidebar : undefined}>
                            <Link href={item.href}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
                })}
            </SidebarMenu>
            <Separator />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                            <span>Log Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </SidebarContent>
    </Sidebar>
  );
}
