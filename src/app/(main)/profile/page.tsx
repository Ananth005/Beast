
'use client';

import { useAuth } from '@/contexts/auth-context';
import { ProfileForm } from '@/components/profile/profile-form';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Profile
      </h1>
      
      {user && <ProfileForm user={user} onUpdate={updateUser} />}

    </div>
  );
}
