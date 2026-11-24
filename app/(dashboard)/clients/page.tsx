import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/RoleHome";
import { requireRole } from "@/lib/dal";
import { getClients, getClientsSummary } from "@/lib/data/clients";
import { ClientsView } from "@/components/clients/ClientsView";

export const metadata: Metadata = {
  title: "Clients | PawHaven",
};

export default function ClientsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ClientsContent />
    </Suspense>
  );
}

async function ClientsContent() {
  await requireRole("admin", "receptionist");

  const [clients, summary] = await Promise.all([
    getClients(),
    getClientsSummary(),
  ]);

  return (
    <ClientsView
      clients={clients}
      totalClients={summary.totalClients}
      totalPets={summary.totalPets}
    />
  );
}
