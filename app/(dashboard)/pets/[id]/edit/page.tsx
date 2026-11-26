import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageSkeleton } from "@/components/dashboard/RoleHome";
import { PetEditView } from "@/components/pets/PetEditView";
import { requireRole } from "@/lib/dal";
import { getPetById } from "@/lib/data/pets";

export const metadata: Metadata = {
    title: "Edit pet | PawHaven",
};

type EditPetPageProps = {
    params: Promise<{ id: string }>;
};

export default function EditPetPage({ params }: EditPetPageProps) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <EditPetContent params={params} />
        </Suspense>
    );
}

async function EditPetContent({ params }: EditPetPageProps) {
    const user = await requireRole("owner");
    const { id } = await params;

    const pet = await getPetById(id, user.id);

    if (!pet) {
        notFound();
    }

    return <PetEditView pet={pet} />;
}
