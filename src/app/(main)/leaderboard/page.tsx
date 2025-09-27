
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { PlusCircle, Trophy } from 'lucide-react';
import { leaderboardData, challenges as initialChallenges } from '@/lib/mock-data';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { ChallengesList } from '@/components/leaderboard/challenges-list';
import { AddEditChallengeDialog } from '@/components/leaderboard/add-edit-challenge-dialog';
import { Challenge } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function LeaderboardPage() {
  const { userRole } = useAuth();
  const categories = Object.keys(leaderboardData);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallengeId, setDeletingChallengeId] = useState<string | null>(null);

  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const { toast } = useToast();

  const handleOpenCreateDialog = () => {
    setEditingChallenge(null);
    setIsChallengeDialogOpen(true);
  };

  const handleOpenEditDialog = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsChallengeDialogOpen(true);
  };

  const handleDeleteClick = (challengeId: string) => {
    setDeletingChallengeId(challengeId);
  };

  const confirmDelete = () => {
    if (deletingChallengeId) {
      setChallenges(challenges.filter((c) => c.id !== deletingChallengeId));
      toast({
        title: 'Challenge Deleted',
        description: 'The challenge has been successfully removed.',
      });
      setDeletingChallengeId(null);
    }
  };

  const handleSaveChallenge = (challengeData: Omit<Challenge, 'id' | 'participantCount'> | Challenge) => {
    if ('id' in challengeData) {
      // Editing existing challenge
      setChallenges(challenges.map(c => c.id === challengeData.id ? challengeData : c));
      toast({
        title: 'Challenge Updated!',
        description: `${challengeData.title} has been updated.`,
      });
    } else {
      // Creating new challenge
      const newChallenge: Challenge = {
        ...challengeData,
        id: uuidv4(),
        participantCount: 0,
      };
      setChallenges([newChallenge, ...challenges]);
      toast({
        title: 'Challenge Created!',
        description: `${newChallenge.title} has been added.`,
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span>Leaderboards & Challenges</span>
          </h1>
          {userRole === 'owner' && (
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Button onClick={handleOpenCreateDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </div>
          )}
        </div>
        
        <ChallengesList 
          challenges={challenges}
          onEdit={userRole === 'owner' ? handleOpenEditDialog : undefined}
          onDelete={userRole === 'owner' ? handleDeleteClick : undefined}
        />

        <Card>
          <CardHeader>
            <CardTitle>Category Leaderboards</CardTitle>
            <CardDescription>
              See who's at the top of their game in different categories.
            </CardDescription>
            <div className="pt-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <LeaderboardTable records={leaderboardData[selectedCategory]} />
          </CardContent>
        </Card>
      </div>

      <AddEditChallengeDialog
        isOpen={isChallengeDialogOpen}
        onOpenChange={setIsChallengeDialogOpen}
        onSaveChallenge={handleSaveChallenge}
        challenge={editingChallenge}
      />

      <AlertDialog open={!!deletingChallengeId} onOpenChange={(open) => !open && setDeletingChallengeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the challenge.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
