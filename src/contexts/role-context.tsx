
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { UserRole } from '@/lib/types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isMounted: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('user');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This logic is now handled by AuthProvider.
    // This provider is kept for now to avoid breaking components that use it,
    // but should be phased out.
    setIsMounted(true);
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, isMounted }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
