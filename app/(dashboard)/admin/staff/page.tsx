import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton, RoleHome } from "@/components/dashboard/RoleHome";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "Staff | PawHaven" };

export default function StaffPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <StaffContent />
    </Suspense>
  );
}

async function StaffContent() {
  const user = await requireRole("admin");

  return (
    <RoleHome
      user={user}
      title="Staff"
      description="Manage the clinic's staff accounts and veterinarian profiles."
      comingNext={[
        "See all staff accounts",
        "Create vet, receptionist, and admin accounts",
        "Deactivate accounts that should no longer sign in",
      ]}
    />
  );
}
