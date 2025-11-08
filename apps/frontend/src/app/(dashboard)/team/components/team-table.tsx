"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditRoleDialog, TeamMember } from "./edit-role-dialog";
import { ToggleStatusDialog } from "./toggle-status-dialog";

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "Lucas Gold",
    email: "lucas.gold@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    lastActivity: "2 days ago",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "MEMBER",
    status: "INACTIVE",
    lastActivity: "1 week ago",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "MEMBER",
    status: "ACTIVE",
    lastActivity: "3 hours ago",
  },
];

export default function TeamTable() {
  const [members, setMembers] = React.useState<TeamMember[]>(initialMembers);
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);
  const [isEditRoleDialogOpen, setEditRoleDialogOpen] = React.useState(false);
  const [isToggleStatusDialogOpen, setToggleStatusDialogOpen] = React.useState(false);

  const handleRoleChange = (memberId: string, newRole: "ADMIN" | "MEMBER") => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const handleStatusChange = (memberId: string, newStatus: "ACTIVE" | "INACTIVE") => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
    );
  };

  const handleOpenDialog = (member: TeamMember, dialog: 'edit' | 'status') => {
    setSelectedMember(member);
    if (dialog === 'edit') {
      setEditRoleDialogOpen(true);
    } else {
      setToggleStatusDialogOpen(true);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.email}</div>
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                <Badge variant={member.status === "ACTIVE" ? "default" : "outline"}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleOpenDialog(member, 'edit')}>
                      Edit role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleOpenDialog(member, 'status')}>
                      {member.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditRoleDialog
        member={selectedMember}
        open={isEditRoleDialogOpen}
        onOpenChange={setEditRoleDialogOpen}
        onRoleChange={handleRoleChange}
      />

      <ToggleStatusDialog
        member={selectedMember}
        open={isToggleStatusDialogOpen}
        onOpenChange={setToggleStatusDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
