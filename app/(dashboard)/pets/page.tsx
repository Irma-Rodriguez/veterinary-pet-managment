import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/RoleHome";
import { PetsView } from "@/components/pets/PetsView";
import { requireRole } from "@/lib/dal";
import { getPetsByOwner } from "@/lib/data/pets";

export const metadata: Metadata = { title: "My pets | PawHaven" };

export default function PetsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PetsContent />
    </Suspense>
  );
}

async function PetsContent() {
  const user = await requireRole("owner");

  console.log("CURRENT USER ID:", user.id);
  console.log("CURRENT USER:", user);

  const pets = await getPetsByOwner(user.id);

  console.log("PETS RESULT:", pets);

  return <PetsView initialPets={pets} />;
}
