// apps/frontend/src/app/(dashboard)/layout.tsx

import { AuthGuard } from "@/app/components/auth-guard";
import { UserNav } from "@/components/layout/user-nav";
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

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 items-center justify-end border-b px-6">
          <UserNav />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
