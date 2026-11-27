import { getCurrentUser } from "@/lib/dal";
import { NAV_BY_ROLE, ROLE_LABELS } from "@/lib/navigation";
import { NavLinks } from "./NavLinks";

// Reads the session, so it must be rendered inside <Suspense>.
export async function SessionNav() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
      <nav aria-label="Dashboard">
        <NavLinks items={NAV_BY_ROLE[user.role]} />
      </nav>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {user.name}
          </p>
          <p className="text-xs font-semibold text-accent-700 dark:text-accent-300">
            {ROLE_LABELS[user.role]}
          </p>
        </div>
        {/* Plain form: signing out works even without JavaScript. */}
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="min-h-10 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export function SessionNavSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-1 items-center justify-between gap-3"
    >
      <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
