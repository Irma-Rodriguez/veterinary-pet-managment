"use client";

import { useState, type FormEvent } from "react";
import type { Pet, Species } from "@/lib/definitions";

type PetFormProps = {
    pet?: Pet;
    onSuccess: () => void;
    onCancel: () => void;
};

export function PetForm({ pet, onSuccess, onCancel }: PetFormProps) {
    const isEditing = Boolean(pet);

    const petId = pet?.id;
    const petName = pet?.name;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);

        const data = {
            name: formData.get("name"),
            species: formData.get("species") as Species,
            breed: formData.get("breed"),
            sex: formData.get("sex"),
            dateOfBirth: formData.get("dateOfBirth"),
            weightKg: formData.get("weightKg"),
            notes: formData.get("notes"),
        };

        try {
            const response = await fetch(
                isEditing ? `/api/pets/${petId}` : "/api/pets",
                {
                    method: isEditing ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Could not save your pet.");
                return;
            }

            onSuccess();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const dateValue = pet?.dateOfBirth
        ? new Date(pet.dateOfBirth).toISOString().split("T")[0]
        : "";

    return (
        <section className="mb-8 rounded-2xl border border-primary-200 bg-white p-6 shadow-sm dark:border-primary-900 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="font-heading text-xl font-bold text-primary-900 dark:text-primary-100">
                    {isEditing ? `Edit ${petName}` : "Add a New Pet"} 🐾
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {isEditing
                        ? "Update your companion's information."
                        : "Tell us a little about your companion."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-semibold">
                        Pet name *
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        maxLength={100}
                        defaultValue={pet?.name ?? ""}
                        placeholder="e.g. Max"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="species" className="mb-1 block text-sm font-semibold">
                        Species *
                    </label>
                    <select
                        id="species"
                        name="species"
                        required
                        defaultValue={pet?.species ?? ""}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                        <option value="" disabled>Select species</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="breed" className="mb-1 block text-sm font-semibold">
                        Breed *
                    </label>
                    <input
                        id="breed"
                        name="breed"
                        required
                        maxLength={100}
                        defaultValue={pet?.breed ?? ""}
                        placeholder="e.g. Golden Retriever"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="sex" className="mb-1 block text-sm font-semibold">
                        Sex *
                    </label>
                    <select
                        id="sex"
                        name="sex"
                        required
                        defaultValue={pet?.sex ?? ""}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                        <option value="" disabled>Select sex</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="dateOfBirth" className="mb-1 block text-sm font-semibold">
                        Date of birth
                    </label>
                    <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        defaultValue={dateValue}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="weightKg" className="mb-1 block text-sm font-semibold">
                        Weight (kg)
                    </label>
                    <input
                        id="weightKg"
                        name="weightKg"
                        type="number"
                        min="0.1"
                        max="999.99"
                        step="0.01"
                        defaultValue={pet?.weightKg ?? ""}
                        placeholder="e.g. 12.5"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="notes" className="mb-1 block text-sm font-semibold">
                        Additional notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        maxLength={500}
                        defaultValue={pet?.notes ?? ""}
                        placeholder="Allergies, special care, or anything we should know..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                </div>

                {error && (
                    <p role="alert" className="text-sm text-red-600 sm:col-span-2">
                        {error}
                    </p>
                )}

                <div className="flex flex-col-reverse justify-end gap-3 sm:col-span-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-900 disabled:opacity-50 dark:bg-primary-600"
                    >
                        {loading
                            ? "Saving..."
                            : isEditing
                                ? "Save Changes"
                                : "Save Pet"}
                    </button>
                </div>
            </form>
        </section>
    );
}