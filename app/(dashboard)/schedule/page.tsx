import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton, RoleHome } from "@/components/dashboard/RoleHome";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "My schedule | PawHaven" };

export default function SchedulePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ScheduleContent />
    </Suspense>
  );
}

async function ScheduleContent() {
  const user = await requireRole("vet");

  return (
    <RoleHome
      user={user}
      title="My schedule"
      description="Your appointments for the day, with each pet's details."
      comingNext={[
        "See today's appointments in time order",
        "Open an appointment to see the pet and owner details",
        "Mark an appointment as completed, with visit notes",
        "Cancel an appointment",
      ]}
    />
  );
}
