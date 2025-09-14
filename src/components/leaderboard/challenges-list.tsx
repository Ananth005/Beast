'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/lib/types';
import { Calendar, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ChallengesListProps {
  challenges: Challenge[];
}

export function ChallengesList({ challenges }: ChallengesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ongoing Challenges</CardTitle>
        <CardDescription>
          Join a challenge and compete with other members.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="p-4 border rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="font-semibold">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
            </div>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4"/>
                    <span>{challenge.participantCount} Participants</span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4"/>
                    <span>Ends on {format(parseISO(challenge.endDate), 'MMMM d, yyyy')}</span>
                </div>
            </div>
            <Button className="mt-4 w-full">View Details</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
