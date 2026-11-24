import { Suspense } from "react";
import { Logo } from "@/components/layout/Logo";
import { SessionNav, SessionNavSkeleton } from "@/components/layout/SessionNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Footer } from "@/components/layout/Footer";

// Layout for every signed-in page. The parts that read the session are in
// <Suspense> so the rest of the page loads instantly (Cache Components).
// The layout does NOT protect pages: each page calls requireRole().
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 md:px-6">
          <Logo />
          <Suspense fallback={<SessionNavSkeleton />}>
            <SessionNav />
          </Suspense>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        {children}
      </main>
      <Footer />
    </>
  );
}
