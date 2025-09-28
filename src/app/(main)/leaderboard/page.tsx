
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { PlusCircle, Trophy, Edit, Trash2, UserPlus, Loader2 } from 'lucide-react';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { AddEditLeaderboardDialog } from '@/components/leaderboard/add-edit-leaderboard-dialog';
import { AddEditRecordDialog } from '@/components/leaderboard/add-edit-record-dialog';
import { LeaderboardRecord, Member } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { getMembers } from '@/lib/services/member-service';
import { 
  getLeaderboards, 
  addLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
  addRecord,
  updateRecord,
  deleteRecord
} from '@/lib/services/leaderboard-service';
import { Skeleton } from '@/components/ui/skeleton';


export type LeaderboardCategory = {
  id: string;
  title: string;
  records: LeaderboardRecord[];
};

export default function LeaderboardPage() {
  const { userRole } = useAuth();
  const { toast } = useToast();

  const [leaderboards, setLeaderboards] = useState<LeaderboardCategory[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLeaderboardDialogOpen, setIsLeaderboardDialogOpen] = useState(false);
  const [editingLeaderboard, setEditingLeaderboard] = useState<LeaderboardCategory | null>(null);
  const [deletingLeaderboardId, setDeletingLeaderboardId] = useState<string | null>(null);

  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{record: LeaderboardRecord, leaderboardId: string} | null>(null);
  const [addingRecordToLeaderboard, setAddingRecordToLeaderboard] = useState<string | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<{record: LeaderboardRecord, leaderboardId: string} | null>(null);

  const fetchData = async () => {
    try {
      const [fetchedLeaderboards, fetchedMembers] = await Promise.all([
          getLeaderboards(),
          getMembers()
      ]);
      setLeaderboards(fetchedLeaderboards);
      setMembers(fetchedMembers);
    } catch (error) {
      toast({ title: 'Error', description: 'Could not fetch leaderboards.', variant: 'destructive' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Leaderboard Category Management ---
  const handleOpenCreateLeaderboard = () => {
    setEditingLeaderboard(null);
    setIsLeaderboardDialogOpen(true);
  };

  const handleOpenEditLeaderboard = (leaderboard: LeaderboardCategory) => {
    setEditingLeaderboard(leaderboard);
    setIsLeaderboardDialogOpen(true);
  };
  
  const handleSaveLeaderboard = async (data: { title: string }) => {
    try {
      if (editingLeaderboard) {
        await updateLeaderboard(editingLeaderboard.id, { title: data.title });
        toast({ title: 'Leaderboard Updated', description: `"${data.title}" has been updated.` });
      } else {
        await addLeaderboard({ title: data.title, records: [] });
        toast({ title: 'Leaderboard Created', description: `"${data.title}" has been added.` });
      }
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save leaderboard.', variant: 'destructive' });
    }
  };

  const handleDeleteLeaderboard = (id: string) => setDeletingLeaderboardId(id);

  const confirmDeleteLeaderboard = async () => {
    if (deletingLeaderboardId) {
      try {
        await deleteLeaderboard(deletingLeaderboardId);
        toast({ title: 'Leaderboard Deleted' });
        fetchData();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete leaderboard.', variant: 'destructive' });
      } finally {
        setDeletingLeaderboardId(null);
      }
    }
  };

  // --- Record Management ---
  const handleOpenAddRecord = (leaderboardId: string) => {
    setEditingRecord(null);
    setAddingRecordToLeaderboard(leaderboardId);
    setIsRecordDialogOpen(true);
  };

  const handleOpenEditRecord = (record: LeaderboardRecord, leaderboardId: string) => {
    setEditingRecord({ record, leaderboardId });
    setAddingRecordToLeaderboard(null);
    setIsRecordDialogOpen(true);
  };

  const handleSaveRecord = async (data: { memberId: string; score: string; rank: number; }) => {
    const member = members.find(m => m.id === data.memberId);
    if (!member) {
      toast({ title: 'Error', description: 'Selected member not found.', variant: 'destructive' });
      return;
    }

    const leaderboardId = addingRecordToLeaderboard || editingRecord?.leaderboardId;
    if (!leaderboardId) return;

    try {
      const newRecordData: LeaderboardRecord = { 
        ...data,
        memberName: member.name,
        memberAvatarUrl: member.avatarUrl,
      };

      if (editingRecord) { // Editing existing record
        await updateRecord(leaderboardId, { ...editingRecord.record, ...newRecordData });
        toast({ title: 'Record Updated' });
      } else { // Adding new record
        await addRecord(leaderboardId, newRecordData);
        toast({ title: 'Record Added' });
      }
      fetchData();
    } catch(error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save record.', variant: 'destructive' });
    }
  };

  const handleDeleteRecord = (record: LeaderboardRecord, leaderboardId: string) => {
    setDeletingRecord({ record, leaderboardId });
  };
  
  const confirmDeleteRecord = async () => {
    if (!deletingRecord) return;
    const { record, leaderboardId } = deletingRecord;

    try {
      await deleteRecord(leaderboardId, record);
      toast({ title: 'Record Deleted' });
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Failed to delete record.', variant: 'destructive' });
    } finally {
      setDeletingRecord(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-44" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span>Gym Records</span>
          </h1>
          {userRole === 'owner' && (
            <Button onClick={handleOpenCreateLeaderboard}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Leaderboard
            </Button>
          )}
        </div>
        
        {leaderboards.map((leaderboard) => (
          <Card key={leaderboard.id}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>{leaderboard.title}</CardTitle>
                <CardDescription>Official gym records for {leaderboard.title ? leaderboard.title.toLowerCase() : ''}.</CardDescription>
              </div>
              {userRole === 'owner' && (
                <div className="flex items-center gap-1">
                  <Button size="sm" onClick={() => handleOpenAddRecord(leaderboard.id)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Record
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenEditLeaderboard(leaderboard)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteLeaderboard(leaderboard.id)}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Delete
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <LeaderboardTable 
                records={leaderboard.records}
                onEdit={userRole === 'owner' ? (record) => handleOpenEditRecord(record, leaderboard.id) : undefined}
                onDelete={userRole === 'owner' ? (record) => handleDeleteRecord(record, leaderboard.id) : undefined}
              />
            </CardContent>
          </Card>
        ))}

        {leaderboards.length === 0 && (
            <Card className="text-center py-12">
                <CardContent>
                    <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Leaderboards Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {userRole === 'owner' ? 'Click "Create Leaderboard" to get started.' : 'The gym owner has not created any leaderboards yet.'}
                    </p>
                </CardContent>
            </Card>
        )}
      </div>

      {/* Dialogs for management */}
      {userRole === 'owner' && (
        <>
          <AddEditLeaderboardDialog
            isOpen={isLeaderboardDialogOpen}
            onOpenChange={setIsLeaderboardDialogOpen}
            onSave={handleSaveLeaderboard}
            leaderboard={editingLeaderboard}
          />
          <AddEditRecordDialog
            isOpen={isRecordDialogOpen}
            onOpenChange={setIsRecordDialogOpen}
            onSave={handleSaveRecord}
            record={editingRecord?.record ?? null}
            members={members}
          />

          {/* Delete confirmation dialogs */}
          <AlertDialog open={!!deletingLeaderboardId} onOpenChange={(open) => !open && setDeletingLeaderboardId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete this leaderboard and all its records. This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteLeaderboard}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={!!deletingRecord} onOpenChange={(open) => !open && setDeletingRecord(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete this record. This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteRecord}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
