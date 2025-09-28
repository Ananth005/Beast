
'use client';

import { useState, useMemo } from 'react';
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
import { PlusCircle, Trophy, Edit, Trash2, UserPlus, GripVertical } from 'lucide-react';
import { leaderboardData as initialLeaderboards } from '@/lib/mock-data';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { AddEditLeaderboardDialog } from '@/components/leaderboard/add-edit-leaderboard-dialog';
import { AddEditRecordDialog } from '@/components/leaderboard/add-edit-record-dialog';
import { LeaderboardRecord } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { members } from '@/lib/mock-data';

export type LeaderboardCategory = {
  id: string;
  title: string;
  records: LeaderboardRecord[];
};

export default function LeaderboardPage() {
  const { userRole } = useAuth();
  const { toast } = useToast();

  const [leaderboards, setLeaderboards] = useState<LeaderboardCategory[]>(() => 
    Object.entries(initialLeaderboards).map(([title, records], index) => ({
      id: `cat-${index + 1}`,
      title,
      records: records.sort((a, b) => a.rank - b.rank)
    }))
  );

  const [isLeaderboardDialogOpen, setIsLeaderboardDialogOpen] = useState(false);
  const [editingLeaderboard, setEditingLeaderboard] = useState<LeaderboardCategory | null>(null);
  const [deletingLeaderboardId, setDeletingLeaderboardId] = useState<string | null>(null);

  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{record: LeaderboardRecord, leaderboardId: string} | null>(null);
  const [addingRecordToLeaderboard, setAddingRecordToLeaderboard] = useState<string | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<{recordId: string, leaderboardId: string} | null>(null);


  // --- Leaderboard Category Management ---
  const handleOpenCreateLeaderboard = () => {
    setEditingLeaderboard(null);
    setIsLeaderboardDialogOpen(true);
  };

  const handleOpenEditLeaderboard = (leaderboard: LeaderboardCategory) => {
    setEditingLeaderboard(leaderboard);
    setIsLeaderboardDialogOpen(true);
  };
  
  const handleSaveLeaderboard = (data: { title: string }) => {
    if (editingLeaderboard) {
      setLeaderboards(leaderboards.map(lb => 
        lb.id === editingLeaderboard.id ? { ...lb, title: data.title } : lb
      ));
      toast({ title: 'Leaderboard Updated', description: `"${data.title}" has been updated.` });
    } else {
      const newLeaderboard: LeaderboardCategory = { id: uuidv4(), title: data.title, records: [] };
      setLeaderboards([...leaderboards, newLeaderboard]);
      toast({ title: 'Leaderboard Created', description: `"${data.title}" has been added.` });
    }
  };

  const handleDeleteLeaderboard = (id: string) => setDeletingLeaderboardId(id);

  const confirmDeleteLeaderboard = () => {
    if (deletingLeaderboardId) {
      setLeaderboards(leaderboards.filter(lb => lb.id !== deletingLeaderboardId));
      toast({ title: 'Leaderboard Deleted' });
      setDeletingLeaderboardId(null);
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

  const handleSaveRecord = (data: { memberId: string; score: string; }) => {
    const member = members.find(m => m.id === data.memberId);
    if (!member) {
      toast({ title: 'Error', description: 'Selected member not found.', variant: 'destructive' });
      return;
    }

    const leaderboardId = addingRecordToLeaderboard || editingRecord?.leaderboardId;
    if (!leaderboardId) return;

    setLeaderboards(leaderboards.map(lb => {
      if (lb.id !== leaderboardId) return lb;
      
      let newRecords: LeaderboardRecord[];
      if (editingRecord) { // Editing existing record
        newRecords = lb.records.map(r => r.rank === editingRecord.record.rank ? { ...r, ...data, memberName: member.name, memberAvatarUrl: member.avatarUrl } : r);
        toast({ title: 'Record Updated' });
      } else { // Adding new record
        const newRecord: LeaderboardRecord = {
          rank: lb.records.length + 1, // This is a simplification, rank should be recalculated
          memberId: member.id,
          memberName: member.name,
          memberAvatarUrl: member.avatarUrl,
          score: data.score,
        };
        newRecords = [...lb.records, newRecord];
        toast({ title: 'Record Added' });
      }
      
      // Re-sort records by rank, assuming lower rank is better. This is naive.
      // A real implementation would parse scores.
      newRecords.sort((a,b) => a.rank - b.rank);
      // Re-assign ranks based on new sort order
      newRecords.forEach((r, i) => r.rank = i + 1);

      return { ...lb, records: newRecords };
    }));
  };

  const handleDeleteRecord = (recordId: string, leaderboardId: string) => {
    setDeletingRecord({ recordId, leaderboardId });
  };
  
  const confirmDeleteRecord = () => {
    if (!deletingRecord) return;
    const { recordId, leaderboardId } = deletingRecord;

    setLeaderboards(leaderboards.map(lb => {
      if (lb.id !== leaderboardId) return lb;
      
      const newRecords = lb.records.filter(r => r.rank.toString() !== recordId); // Assuming rank is unique ID for now
      // Re-assign ranks
      newRecords.sort((a,b) => a.rank - b.rank).forEach((r, i) => r.rank = i + 1);

      return { ...lb, records: newRecords };
    }));

    toast({ title: 'Record Deleted' });
    setDeletingRecord(null);
  };


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
                <CardDescription>Official gym records for {leaderboard.title.toLowerCase()}.</CardDescription>
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
                onDelete={userRole === 'owner' ? (recordId) => handleDeleteRecord(recordId, leaderboard.id) : undefined}
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
