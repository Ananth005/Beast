
'use client';

import { useAuth } from '@/contexts/auth-context';
import { ProfileForm } from '@/components/profile/profile-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();

  if (loading) {
      return (
          <div className="space-y-6">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-96 w-full" />
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Profile
      </h1>
      
      {user && <ProfileForm user={user} onUpdate={updateUser} />}

    </div>
  );
}

    