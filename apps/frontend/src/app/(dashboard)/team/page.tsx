"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import TeamTable from "./components/team-table";
import { InviteMemberDialog } from "./components/invite-member-dialog";
import { useTeamStore } from "@/lib/store/team-store";

export default function TeamPage() {
  const [isInviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const { members, isLoading, error, fetchMembers, updateMember } = useTeamStore();

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRoleChange = (memberId: string, newRole: 'ADMIN' | 'MEMBER') => {
    updateMember(memberId, newRole);
  };

  const handleStatusChange = (memberId: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
    // The current backend implementation doesn't support changing status directly.
    // This is a placeholder for future functionality.
    console.log(`Status change for ${memberId} to ${newStatus} is not implemented yet.`);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Équipe</h1>
        <InviteMemberDialog
          open={isInviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
        >
          <Button>Inviter un membre</Button>
        </InviteMemberDialog>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <TeamTable 
          members={members} 
          onRoleChange={handleRoleChange} 
          onStatusChange={handleStatusChange} 
        />
      )}
    </div>
  );
}
