import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
    { href: "/pets", label: "My Pets", active: true },
    { href: "/appointments", label: "Appointments", active: false },
    { href: "/profile", label: "My Profile", active: false },
];

export function OwnerHeader() {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
                <Logo />

                <nav aria-label="Owner navigation" className="flex items-center gap-2">
                    <ul className="hidden items-center gap-1 md:flex">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    aria-current={item.active ? "page" : undefined}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${item.active
                                            ? "bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-200"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-300"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}