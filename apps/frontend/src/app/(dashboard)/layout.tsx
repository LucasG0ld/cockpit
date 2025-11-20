// apps/frontend/src/app/(dashboard)/layout.tsx

import { AuthGuard } from "@/app/components/auth-guard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <AuthGuard>{children}</AuthGuard>;
}
