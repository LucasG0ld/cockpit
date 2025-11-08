"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import TeamTable from "./components/team-table";
import { InviteMemberDialog } from "./components/invite-member-dialog";

export default function TeamPage() {
  const [isInviteDialogOpen, setInviteDialogOpen] = React.useState(false);

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
      <TeamTable />
    </div>
  );
}
