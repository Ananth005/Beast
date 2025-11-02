
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { seedDatabase } from '@/lib/services/seed-service';
import { Textarea } from "@/components/ui/textarea";
import { addMember } from '@/lib/services/member-service';
import { Loader } from '@/components/ui/loader';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [contactsJson, setContactsJson] = useState('');
  const [isImporting, setIsImporting] = useState(false);

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

  const handleImportContacts = async () => {
    setIsImporting(true);
    try {
      const contacts = JSON.parse(contactsJson);
      if (!Array.isArray(contacts)) {
        throw new Error('Invalid JSON format. Expected an array of contacts.');
      }

      let successCount = 0;
      for (const contact of contacts) {
        if (contact.saved_name && contact.phone_number) {
          try {
            await addMember({
              name: contact.saved_name,
              mobileNumber: contact.phone_number,
              email: '',
              gender: 'other',
              joinDate: new Date().toISOString(),
              membershipStatus: 'active',
            });
            successCount++;
          } catch (error) {
            console.error(`Failed to import contact ${contact.saved_name}:`, error);
          }
        }
      }

      toast({
        title: 'Import Complete',
        description: `${successCount} out of ${contacts.length} contacts were imported successfully.`,
      });
      setContactsJson('');
    } catch (error) {
      console.error('Failed to import contacts:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Import Failed',
        description: `There was an error: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
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
            </CardDescription>.
        </CardHeader>
        <CardContent>
            <Button onClick={handleSeed} disabled={isSeeding}>
                {isSeeding ? (
                    <>
                        <Loader className="mr-2 h-4 w-4" />
                        Seeding...
                    </>
                ) : (
                    'Seed Database'
                )}
            </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Import Contacts</CardTitle>
          <CardDescription>
            Paste a JSON array of contacts to import them as members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your JSON here..."
            className="h-40"
            value={contactsJson}
            onChange={(e) => setContactsJson(e.target.value)}
            disabled={isImporting}
          />
          <Button onClick={handleImportContacts} disabled={isImporting || !contactsJson}>
            {isImporting ? (
              <>
                <Loader className="mr-2 h-4 w-4" />
                Importing...
              </>
            ) : (
              'Import Contacts'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
