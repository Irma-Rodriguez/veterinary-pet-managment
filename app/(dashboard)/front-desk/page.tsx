import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton, RoleHome } from "@/components/dashboard/RoleHome";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "Front desk | PawHaven" };

export default function FrontDeskPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FrontDeskContent />
    </Suspense>
  );
}

async function FrontDeskContent() {
  const user = await requireRole("receptionist");

  return (
    <RoleHome
      user={user}
      title="Front desk"
      description="All of the clinic's appointments, and booking for clients who call."
      comingNext={[
        "See all appointments for a day, filtered by vet and status",
        "Search an owner by name or email",
        "Book, reschedule, cancel, or complete any appointment",
      ]}
    />
  );
}
