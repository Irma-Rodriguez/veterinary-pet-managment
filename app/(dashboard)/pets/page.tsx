import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton, RoleHome } from "@/components/dashboard/RoleHome";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "My pets | PawHaven" };

export default function PetsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PetsContent />
    </Suspense>
  );
}

async function PetsContent() {
  // Only owners can see this page. Other roles go to their own start page.
  const user = await requireRole("owner");

  return (
    <RoleHome
      user={user}
      title="My pets"
      description="Keep your pets' information in one place and book their visits online."
      comingNext={[
        "See all your pets in one list",
        "Add a new pet with its species, breed, and notes",
        "Edit or remove a pet",
        "Book, reschedule, and cancel appointments",
      ]}
    />
  );
}
