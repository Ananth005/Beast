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
import { Button } from '@/components/ui/button';
import { PlusCircle, Trophy } from 'lucide-react';
import { leaderboardData, challenges as initialChallenges } from '@/lib/mock-data';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { ChallengesList } from '@/components/leaderboard/challenges-list';
import { CreateChallengeDialog } from '@/components/leaderboard/create-challenge-dialog';
import { Challenge } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export default function LeaderboardPage() {
  const categories = Object.keys(leaderboardData);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const { toast } = useToast();

  const handleAddChallenge = (newChallengeData: Omit<Challenge, 'id' | 'participantCount'>) => {
    const newChallenge: Challenge = {
      ...newChallengeData,
      id: uuidv4(),
      participantCount: 0,
    };
    setChallenges([newChallenge, ...challenges]);
    toast({
      title: 'Challenge Created!',
      description: `${newChallenge.title} has been added.`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span>Leaderboards & Challenges</span>
          </h1>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Button onClick={() => setIsCreateChallengeOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Challenge
            </Button>
          </div>
        </div>
        
        <ChallengesList challenges={challenges} />

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

      <CreateChallengeDialog
        isOpen={isCreateChallengeOpen}
        onOpenChange={setIsCreateChallengeOpen}
        onAddChallenge={handleAddChallenge}
      />
    </>
  );
}
