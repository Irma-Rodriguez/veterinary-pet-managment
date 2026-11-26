import type { Pet } from "@/lib/definitions";

type PetCardProps = {
    pet: Pet;
    onEdit: (pet: Pet) => void;
    onDelete: (pet: Pet) => void;
    isDeleting: boolean;
};

export function PetCard({
    pet,
    onEdit,
    onDelete,
    isDeleting,
}: PetCardProps) {
    const isDog = pet.species === "dog";

    const color = isDog
        ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
        : "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300";

    function calculateAge(dateOfBirth: Date | null) {
        if (!dateOfBirth) return "Age not available";

        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassed) years--;

        if (years < 1) return "Less than 1 year old";

        return years === 1 ? "1 year old" : `${years} years old`;
    }

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
                <div
                    className={`flex size-16 shrink-0 items-center justify-center rounded-2xl font-heading text-2xl font-extrabold ${color}`}
                    aria-hidden="true"
                >
                    {pet.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                    <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                        {pet.name}
                    </h2>

                    <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
                        {pet.species} · {pet.breed ?? "Mixed breed"}
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
                        {calculateAge(pet.dateOfBirth)}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Weight
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                        {pet.weightKg ? `${pet.weightKg} kg` : "Not available"}
                    </p>
                </div>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                    Pet information
                </span>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {pet.notes || "No additional notes."}
                </p>
            </div>

            <div className="flex gap-3 border-t border-slate-100 p-4 dark:border-slate-800">
                <button
                    type="button"
                    onClick={() => onEdit(pet)}
                    disabled={isDeleting}
                    className="flex-1 rounded-lg border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-50 dark:border-primary-800 dark:text-primary-300 dark:hover:bg-primary-950"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(pet)}
                    disabled={isDeleting}
                    className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
}
