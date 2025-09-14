'use client';

import { useRole } from '@/contexts/role-context';
import { UserDashboard } from '@/components/dashboard/user-dashboard';
import { OwnerDashboard } from '@/components/dashboard/owner-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { role, isMounted } = useRole();

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {role === 'user' ? <UserDashboard /> : <OwnerDashboard />}
    </div>
  );
}
