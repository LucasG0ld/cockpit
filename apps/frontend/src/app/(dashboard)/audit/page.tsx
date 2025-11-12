"use client";

import * as React from "react";
import { AuditTable } from "./components/audit-table";
import { useAuditStore } from "@/lib/store/audit-store";

const AuditPage = () => {
  const { events, isLoading, error, fetchAuditEvents } = useAuditStore();

  React.useEffect(() => {
    fetchAuditEvents();
  }, [fetchAuditEvents]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Audit Trail</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && <AuditTable events={events} />}
    </div>
  );
};

export default AuditPage;
