'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardRecord } from '@/lib/types';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  records: LeaderboardRecord[];
}

export function LeaderboardTable({ records }: LeaderboardTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Member</TableHead>
            <TableHead className="text-right">Record</TableHead>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
