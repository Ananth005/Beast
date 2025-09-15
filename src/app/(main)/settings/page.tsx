
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { seedDatabase } from '@/lib/services/seed-service';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: 'Database Seeded!',
        description: 'Your database has been populated with mock data.',
      });
    } catch (error) {
      console.error('Failed to seed database:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Seeding Failed',
        description: `There was an error: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };


  return (
    <div className="space-y-6">
       <h1 className="font-headline text-3xl font-bold tracking-tight">
        Settings
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Gym Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Gym settings management coming soon.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Database Seeding</CardTitle>
            <CardDescription>
                Populate your Firestore database with the initial mock data to get the app up and running. 
                This will create collections for members, payments, exercises, etc. 
                Warning: Running this multiple times may create duplicate data.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleSeed} disabled={isSeeding}>
                {isSeeding ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Seeding...
                    </>
                ) : (
                    'Seed Database'
                )}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
