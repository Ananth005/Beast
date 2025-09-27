
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
import { PlusCircle, Trophy, Edit, Trash2 } from 'lucide-react';
import { leaderboardData, challenges as initialChallenges } from '@/lib/mock-data';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { AddEditChallengeDialog } from '@/components/leaderboard/add-edit-challenge-dialog';
import { Challenge } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LeaderboardPage() {
  const { userRole } = useAuth();
  
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallengeId, setDeletingChallengeId] = useState<string | null>(null);

  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const { toast } = useToast();

  const challengeCategories = useMemo(() => {
    const categories = challenges.map(c => c.category);
    return [...new Set(categories)];
  }, [challenges]);

  const [selectedCategory, setSelectedCategory] = useState(challengeCategories[0] || '');

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
      setChallenges(challenges.map(c => c.id === challengeData.id ? challengeData as Challenge : c));
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
        
        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Challenges</CardTitle>
                    <CardDescription>Join a challenge and see where you rank!</CardDescription>
                </CardHeader>
                <CardContent>
                    <TabsList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-auto bg-transparent p-0">
                        {challenges.map((challenge) => (
                        <TabsTrigger key={challenge.id} value={challenge.category} className="h-auto p-4 border rounded-lg flex flex-col justify-between items-start text-left data-[state=active]:border-primary data-[state=active]:shadow-lg relative">
                            <div>
                                <h3 className="font-semibold">{challenge.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 font-normal">{challenge.description}</p>
                            </div>
                            {userRole === 'owner' && (
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(challenge);}}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDeleteClick(challenge.id);}}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            )}
                        </TabsTrigger>
                        ))}
                    </TabsList>
                </CardContent>
            </Card>

            {challengeCategories.map((category) => (
                <TabsContent key={category} value={category}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{category} Leaderboard</CardTitle>
                            <CardDescription>See who's at the top of their game in {category.toLowerCase()}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable records={leaderboardData[category] || []} />
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>

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
