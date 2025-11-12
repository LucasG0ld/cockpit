import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { AuditEvent } from "@/lib/store/audit-store";

interface AuditTableProps {
  events: AuditEvent[];
}

export const AuditTable = ({ events }: AuditTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Acteur</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Cible</TableHead>
          <TableHead>Détails</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
            <TableCell>{log.actor.name}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{`${log.target.type}:${log.target.id}`}</TableCell>
            <TableCell>{}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
