import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const auditLogs = [
  {
    date: "2023-10-27T10:00:00Z",
    actor: "admin@example.com",
    action: "USER_INVITE",
    target: "user@example.com",
    details: "Invited with role MEMBER",
  },
  {
    date: "2023-10-27T10:05:00Z",
    actor: "admin@example.com",
    action: "USER_ROLE_CHANGE",
    target: "user@example.com",
    details: "Changed role from MEMBER to ADMIN",
  },
  {
    date: "2023-10-27T11:00:00Z",
    actor: "user@example.com",
    action: "LOGIN_SUCCESS",
    target: "session",
    details: "User logged in successfully",
  },
];

export const AuditTable = () => {
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
        {auditLogs.map((log, index) => (
          <TableRow key={index}>
            <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
            <TableCell>{log.actor}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.target}</TableCell>
            <TableCell>{log.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
