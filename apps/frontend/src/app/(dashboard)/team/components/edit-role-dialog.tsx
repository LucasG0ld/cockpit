"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// This type needs to be defined or imported. For now, we'll create a basic version.
// Ideally, this would be imported from wherever the team member data structure is defined, e.g., `../columns.tsx`
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
  lastActivity: string;
}

const editRoleSchema = z.object({
  role: z.string().refine((val) => val === "ADMIN" || val === "MEMBER", {
    message: "Please select a role.",
  }),
});

type EditRoleFormValues = z.infer<typeof editRoleSchema>;

interface EditRoleDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (memberId: string, newRole: "ADMIN" | "MEMBER") => void;
}

export function EditRoleDialog({ member, open, onOpenChange, onRoleChange }: EditRoleDialogProps) {
  const form = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
  });

  React.useEffect(() => {
    if (member) {
      form.reset({ role: member.role });
    }
  }, [member, form]);

  const onSubmit = async (data: EditRoleFormValues) => {
    if (!member) return;

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Role updated!", {
      description: `${member.name}'s role has been updated to ${data.role}.`,
    });
    onRoleChange(member.id, data.role as "ADMIN" | "MEMBER");
    onOpenChange(false);
  };

  if (!member) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit role for {member.name}</DialogTitle>
          <DialogDescription>
            Select a new role for this member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MEMBER">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Updating..." : "Update Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
