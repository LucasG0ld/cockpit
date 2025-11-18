// apps/frontend/src/app/(dashboard)/layout.tsx

import { AuthGuard } from "@/app/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
