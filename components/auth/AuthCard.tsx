import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/Logo";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-slate-50 px-4 py-12 md:py-20 dark:from-primary-950 dark:to-slate-950">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 text-center">
          <LogoMark className="mx-auto size-14" />
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-primary-900 dark:text-primary-100">
            {title}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
