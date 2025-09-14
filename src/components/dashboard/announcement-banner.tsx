'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone, X } from 'lucide-react';
import { Announcement } from '@/lib/types';
import { announcements as mockAnnouncements } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this from a server.
    const activeAnnouncements = mockAnnouncements.filter(
      (a) => new Date(a.expiry) > new Date()
    );
    setAnnouncements(activeAnnouncements);
  }, []);

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Alert key={announcement.id} className="relative bg-primary/10 border-primary/50 text-primary-foreground">
          <Megaphone className="h-4 w-4 !text-primary" />
          <AlertTitle className="font-semibold !text-primary">Announcement</AlertTitle>
          <AlertDescription className="!text-primary/90">
            {announcement.message}
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 !text-primary/70 hover:!text-primary"
            onClick={() => dismissAnnouncement(announcement.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  );
}
