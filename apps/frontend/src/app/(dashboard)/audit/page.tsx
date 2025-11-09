import { AuditTable } from "./components/audit-table";

const AuditPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Audit Trail</h1>
      <AuditTable />
    </div>
  );
};

export default AuditPage;
