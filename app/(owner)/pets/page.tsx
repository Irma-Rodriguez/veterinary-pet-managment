"use client";

import { useState, type FormEvent } from "react";
import { PawIcon } from "@/components/layout/Logo";
import { Footer } from "@/components/layout/Footer";
import { OwnerHeader } from "@/components/layout/OwnerHeader";

type Pet = {
    id: number;
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
    initials: string;
    color: string;
    sex?: string;
    notes?: string;
};

const demoPets: Pet[] = [
    {
        id: 1,
        name: "Luna",
        species: "Dog",
        breed: "Golden Retriever",
        age: "3 years old",
        weight: "25 kg",
        initials: "L",
        color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    },
    {
        id: 2,
        name: "Milo",
        species: "Cat",
        breed: "Tabby",
        age: "2 years old",
        weight: "4.5 kg",
        initials: "M",
        color: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    },
];

function PetCard({ pet }: { pet: Pet }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
                <div
                    className={`flex size-16 shrink-0 items-center justify-center rounded-2xl font-heading text-2xl font-extrabold ${pet.color}`}
                    aria-hidden="true"
                >
                    {pet.initials}
                </div>
                <div className="min-w-0">
                    <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                        {pet.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {pet.species} · {pet.breed}
                    </p>
                </div>
                <span className="ml-auto text-2xl" aria-hidden="true">
                    🐾
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Age
                    </p>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                        {pet.age}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Weight
                    </p>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                        {pet.weight}
                    </p>
                </div>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                    Pet information
                </span>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Detailed pet records will be available soon.
                </p>
            </div>
        </article>
    );
}

export default function PetsPage() {
    const [pets, setPets] = useState<Pet[]>(demoPets);
    const [isFormOpen, setIsFormOpen] = useState(false);

    function calculateAge(dateOfBirth: string) {
        const birthDate = new Date(`${dateOfBirth}T00:00:00`);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassed) {
            years--;
        }

        return years === 1 ? "1 year old" : `${years} years old`;
    }

    function handleAddPet(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const name = String(formData.get("name") ?? "").trim();
        const species = String(formData.get("species") ?? "");
        const breed = String(formData.get("breed") ?? "").trim();
        const sex = String(formData.get("sex") ?? "");
        const dateOfBirth = String(formData.get("dateOfBirth") ?? "");
        const weight = String(formData.get("weight") ?? "").trim();
        const notes = String(formData.get("notes") ?? "").trim();

        const newPet: Pet = {
            id: Date.now(),
            name,
            species,
            breed,
            sex,
            age: calculateAge(dateOfBirth),
            weight: `${weight} kg`,
            initials: name.charAt(0).toUpperCase(),
            color: "bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-200",
            notes,
        };

        setPets((currentPets) => [...currentPets, newPet]);
        setIsFormOpen(false);
        event.currentTarget.reset();
    }
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <OwnerHeader />

            <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
                        <PawIcon className="size-5" />
                        PawHaven Pet Portal
                    </div>

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="font-heading text-3xl font-extrabold text-primary-900 dark:text-primary-100 md:text-4xl">
                                My Pets
                            </h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                All your beloved companions in one place.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900 dark:bg-primary-600 dark:hover:bg-primary-700"
                        >
                            <span aria-hidden="true">+</span>
                            Add New Pet
                        </button>
                    </div>
                </div>
                
                {isFormOpen && (
                    <section
                        aria-labelledby="add-pet-heading"
                        className="mb-8 rounded-2xl border border-primary-200 bg-white p-6 shadow-sm dark:border-primary-900 dark:bg-slate-900"
                    >
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2
                                    id="add-pet-heading"
                                    className="font-heading text-xl font-bold text-primary-900 dark:text-primary-100"
                                >
                                    Add a New Pet 🐾
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Tell us a little about your companion.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                aria-label="Close form"
                                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddPet} className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="mb-1 block text-sm font-semibold">
                                    Pet name *
                                </label>
                                <input id="name" name="name" required maxLength={50}
                                    placeholder="e.g. Max"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="species" className="mb-1 block text-sm font-semibold">
                                    Species *
                                </label>
                                <select id="species" name="species" required defaultValue=""
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                >
                                    <option value="" disabled>Select species</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Rabbit">Rabbit</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="breed" className="mb-1 block text-sm font-semibold">
                                    Breed *
                                </label>
                                <input id="breed" name="breed" required maxLength={60}
                                    placeholder="e.g. Golden Retriever"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="sex" className="mb-1 block text-sm font-semibold">
                                    Sex *
                                </label>
                                <select id="sex" name="sex" required defaultValue=""
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                >
                                    <option value="" disabled>Select sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="dateOfBirth" className="mb-1 block text-sm font-semibold">
                                    Date of birth *
                                </label>
                                <input id="dateOfBirth" name="dateOfBirth" type="date"
                                    required max={new Date().toISOString().split("T")[0]}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="weight" className="mb-1 block text-sm font-semibold">
                                    Weight (kg) *
                                </label>
                                <input id="weight" name="weight" type="number" min="0.1"
                                    max="999" step="0.1" required placeholder="e.g. 12.5"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="notes" className="mb-1 block text-sm font-semibold">
                                    Additional notes
                                </label>
                                <textarea id="notes" name="notes" rows={3} maxLength={500}
                                    placeholder="Allergies, special care, or anything we should know..."
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                                <button type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                >
                                    Cancel
                                </button>

                                <button type="submit"
                                    className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-900 dark:bg-primary-600"
                                >
                                    Save Pet
                                </button>
                            </div>
                        </form>
                    </section>
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
                                <PetCard key={pet.id} pet={pet} />
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

                <p className="mt-8 text-center text-xs text-slate-400">
                    Demonstration data · PawHaven Veterinary Clinic
                </p>
            </main>
            <Footer />
        </div>
    );
}