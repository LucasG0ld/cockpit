"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TeamMember } from "./edit-role-dialog"; // Re-using the type from the other dialog

interface ToggleStatusDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (memberId: string, newStatus: "ACTIVE" | "INACTIVE") => void;
}

export function ToggleStatusDialog({ member, open, onOpenChange, onStatusChange }: ToggleStatusDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleStatusToggle = async () => {
    if (!member) return;

    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newStatus = member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = newStatus === "ACTIVE" ? "reactivated" : "deactivated";

    toast.success("Status updated!", {
      description: `${member.name} has been ${actionText}.`,
    });

    onStatusChange(member.id, newStatus);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!member) {
    return null;
  }

  const isActivating = member.status === "INACTIVE";
  const title = isActivating ? `Reactivate ${member.name}` : `Deactivate ${member.name}`;
  const description = isActivating
    ? "This will allow the member to access the platform again. Are you sure?"
    : "This will revoke the member's access to the platform. Are you sure?";
  const buttonText = isActivating ? "Reactivate" : "Deactivate";
  const buttonVariant = isActivating ? "default" : "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant={buttonVariant} onClick={handleStatusToggle} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
