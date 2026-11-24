"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Pet } from "@/lib/definitions";
import { PetCard } from "./PetCard";
import { PetForm } from "./PetForm";

type PetsViewProps = {
    initialPets: Pet[];
};

export function PetsView({ initialPets }: PetsViewProps) {
    const router = useRouter();
    const [pets, setPets] = useState(initialPets);
    useEffect(() => {
        setPets(initialPets);
    }, [initialPets]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [error, setError] = useState("");
    const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

    function handleAddPet() {
        setIsFormOpen(true);
        setError("");
    }

    function handleEditPet(pet: Pet) {
        router.push(`/pets/${pet.id}/edit`);
    }

    function handleCancel() {
        setIsFormOpen(false);
        setError("");
    }

    function handleSuccess() {
        setIsFormOpen(false);
        router.refresh();
    }

    async function handleDeletePet(pet: Pet) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${pet.name}? Its appointments will also be deleted.`
        );

        if (!confirmed) return;

        setDeletingPetId(pet.id);
        setError("");

        try {
            const response = await fetch(`/api/pets/${pet.id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Could not delete this pet.");
                return;
            }

            setPets((currentPets) =>
                currentPets.filter((item) => item.id !== pet.id)
            );
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setDeletingPetId(null);
        }
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
                            <span aria-hidden="true">🐾</span>
                            PawHaven Pet Portal
                        </div>

                        <h1 className="font-heading text-3xl font-extrabold text-primary-900 dark:text-primary-100 md:text-4xl">
                            My Pets
                        </h1>

                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            All your beloved companions in one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddPet}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900 dark:bg-primary-600"
                    >
                        <span aria-hidden="true">+</span>
                        Add New Pet
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <PetForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}

            {error && (
                <p
                    role="alert"
                    className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
                >
                    {error}
                </p>
            )}

            <section aria-labelledby="pets-heading">
                <div className="mb-5 flex items-center justify-between">
                    <h2
                        id="pets-heading"
                        className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100"
                    >
                        Your companions
                    </h2>

                    <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800 dark:bg-primary-950 dark:text-primary-200">
                        {pets.length} pets
                    </span>
                </div>

                {pets.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {pets.map((pet) => (
                            <PetCard
                                key={pet.id}
                                pet={pet}
                                onEdit={handleEditPet}
                                onDelete={handleDeletePet}
                                isDeleting={deletingPetId === pet.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-4 text-5xl" aria-hidden="true">
                            🐾
                        </div>

                        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                            No pets yet!
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                            Your pet family starts here. Add your first companion to keep
                            their information organized.
                        </p>
                    </div>
                )}
            </section>

            <div className="mt-10 rounded-2xl bg-primary-50 p-6 dark:bg-primary-950/50">
                <h2 className="font-heading text-lg font-bold text-primary-900 dark:text-primary-100">
                    A little reminder 🧡
                </h2>

                <p className="mt-2 text-sm text-primary-800 dark:text-primary-200">
                    Regular checkups help keep your furry friends healthy and happy.
                    Contact PawHaven to schedule their next visit.
                </p>
            </div>
        </div>
    );
}