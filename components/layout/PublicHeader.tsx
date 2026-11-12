import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { href: "/#services", label: "Services" },
  { href: "/#team", label: "Our team" },
  { href: "/#visit", label: "Visit us" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <ul className="mr-2 hidden items-center gap-1 lg:flex">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-slate-300 dark:hover:text-primary-300"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:inline-block dark:text-slate-300 dark:hover:text-primary-300"
          >
            Sign in
          </Link>
          <ButtonLink href="/register" className="px-3 sm:px-5">
            Book<span className="hidden sm:inline">&nbsp;appointment</span>
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
