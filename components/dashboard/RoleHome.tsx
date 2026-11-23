import type { User } from "@/lib/definitions";
import { ROLE_LABELS } from "@/lib/navigation";

// Temporary start page for each role until its real page is built.
export function RoleHome({
  user,
  title,
  description,
  comingNext,
}: {
  user: User;
  title: string;
  description: string;
  comingNext: string[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-accent-700 dark:text-accent-300">
          {ROLE_LABELS[user.role]}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-primary-900 md:text-4xl dark:text-primary-100">
          Welcome, {user.name.split(" ")[0]}!
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          This section is under construction. Coming next:
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
          {comingNext.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
