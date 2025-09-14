'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import { members as initialMembers } from '@/lib/mock-data';
import { MembersTable } from '@/components/members/members-table';
import { Member } from '@/lib/types';
import { AddMemberDialog } from '@/components/members/add-member-dialog';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = (newMember: Omit<Member, 'id' | 'lastVisit' | 'avatarUrl'>) => {
    const member: Member = {
      ...newMember,
      id: (members.length + 1).toString(),
      lastVisit: new Date().toISOString(),
      avatarUrl: `https://picsum.photos/seed/${members.length + 1}/100/100`,
    };
    setMembers([member, ...members]);
  };
  
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Member Management
        </h1>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="w-full pl-9 md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddMemberOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>
      
      <MembersTable 
        members={filteredMembers} 
        onEdit={handleUpdateMember} 
        onDelete={handleDeleteMember}
      />

      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
