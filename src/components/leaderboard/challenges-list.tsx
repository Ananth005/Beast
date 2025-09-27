
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/lib/types';
import { Calendar, Users, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';


interface ChallengesListProps {
  challenges: Challenge[];
  onEdit?: (challenge: Challenge) => void;
  onDelete?: (challengeId: string) => void;
}

export function ChallengesList({ challenges, onEdit, onDelete }: ChallengesListProps) {
  const isOwner = !!(onEdit && onDelete);
  
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
          <div key={challenge.id} className="relative p-4 border rounded-lg flex flex-col justify-between">
            {isOwner && (
              <div className="absolute top-2 right-2">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => onEdit(challenge)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onDelete(challenge.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div>
              <h3 className="font-semibold pr-8">{challenge.title}</h3>
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
