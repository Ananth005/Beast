
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardRecord } from '@/lib/types';
import { Trophy, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  records: LeaderboardRecord[];
  onEdit?: (record: LeaderboardRecord) => void;
  onDelete?: (recordId: string) => void;
}

export function LeaderboardTable({ records, onEdit, onDelete }: LeaderboardTableProps) {
  const isOwner = !!(onEdit && onDelete);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Member</TableHead>
            <TableHead className="text-right">Record</TableHead>
            {isOwner && <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((record) => (
              <TableRow key={record.rank}>
                <TableCell className="font-bold text-lg text-center">
                  <div className="flex items-center justify-center">
                    {record.rank === 1 && <Trophy className="w-6 h-6 text-yellow-500 mr-2" />}
                    {record.rank === 2 && <Trophy className="w-5 h-5 text-gray-400 mr-2" />}
                    {record.rank === 3 && <Trophy className="w-4 h-4 text-orange-400 mr-2" />}
                    <span>{record.rank}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={record.memberAvatarUrl} alt={record.memberName} />
                      <AvatarFallback>{record.memberName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{record.memberName}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{record.score}</TableCell>
                {isOwner && (
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => onEdit(record)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onDelete(record.rank.toString())} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isOwner ? 4 : 3} className="h-24 text-center">
                No records yet. Be the first!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
