import Link from "next/link";
import { clinic } from "@/lib/clinic";
import { Logo } from "./Logo";

const linkClass =
  "rounded hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-100";

export function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo light />
          <p className="text-sm">{clinic.tagline}</p>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-white">
            Contact
          </h2>
          <address className="mt-3 space-y-1 text-sm not-italic">
            <p>{clinic.address.street}</p>
            <p>
              {clinic.address.city}, {clinic.address.region}
            </p>
            <p>
              <a href={`tel:${clinic.phone}`} className={linkClass}>
                {clinic.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${clinic.email}`} className={linkClass}>
                {clinic.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-white">Hours</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {clinic.hours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-white">
            Accounts
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link href="/register" className={linkClass}>
                Create an owner account
              </Link>
            </li>
            <li>
              <Link href="/login" className={linkClass}>
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/login" className={linkClass}>
                Staff sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs md:px-6">
          &copy; 2026 {clinic.name}. Fictional clinic created for the WDD430
          team project.
        </p>
      </div>
    </footer>
  );
}
