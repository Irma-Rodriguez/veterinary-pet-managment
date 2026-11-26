"use client";

import { useRouter } from "next/navigation";
import type { Pet } from "@/lib/definitions";
import { PetForm } from "./PetForm";

type PetEditViewProps = {
    pet: Pet;
};

export function PetEditView({ pet }: PetEditViewProps) {
    const router = useRouter();

    function handleSuccess() {
        router.push("/pets");
        router.refresh();
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => router.push("/pets")}
                className="mb-6 text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
            >
                Back to My Pets
            </button>

            <div className="mb-6">
                <h1 className="font-heading text-3xl font-extrabold text-primary-900 dark:text-primary-100">
                    Edit Pet
                </h1>

                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Update {pet.name}&apos;s information.
                </p>
            </div>

            <PetForm
                pet={pet}
                onSuccess={handleSuccess}
                onCancel={() => router.push("/pets")}
            />
        </div>
    );
}
