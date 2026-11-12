import Link from "next/link";

// Brand mark: same drawing as public/logo.svg and app/icon.svg.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        d="M32 4 7 18.5V44c0 9 7 16 16 16h18c9 0 16-7 16-16V18.5Z"
        fill="#0f766e"
      />
      <g fill="#ffffff">
        <ellipse cx="20.5" cy="31" rx="3.6" ry="4.6" />
        <ellipse cx="27.5" cy="24.5" rx="3.6" ry="4.6" />
        <ellipse cx="36.5" cy="24.5" rx="3.6" ry="4.6" />
        <ellipse cx="43.5" cy="31" rx="3.6" ry="4.6" />
        <path d="M32 33.5c-5.6 0-11 6.4-11 11.2 0 3.1 2.4 5.1 5.5 5.1 2.2 0 3.6-1.1 5.5-1.1s3.3 1.1 5.5 1.1c3.1 0 5.5-2 5.5-5.1 0-4.8-5.4-11.2-11-11.2Z" />
      </g>
      <circle
        cx="51"
        cy="13"
        r="10"
        fill="#f97316"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <path
        d="M51 8.5v9M46.5 13h9"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Simple paw used as a decorative icon inside the pages.
export function PawIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="6" cy="9" rx="2" ry="2.6" />
      <ellipse cx="10" cy="5.5" rx="2" ry="2.6" />
      <ellipse cx="14" cy="5.5" rx="2" ry="2.6" />
      <ellipse cx="18" cy="9" rx="2" ry="2.6" />
      <path d="M12 11c-3 0-6 3.6-6 6.3C6 19 7.3 20 9 20c1.2 0 2-.6 3-.6s1.8.6 3 .6c1.7 0 3-1 3-2.7 0-2.7-3-6.3-6-6.3Z" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="PawHaven Veterinary Clinic, home"
      className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <LogoMark className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-heading text-xl font-extrabold ${light ? "text-white" : "text-primary-900 dark:text-primary-100"}`}
        >
          Paw
          <span
            className={
              light ? "text-accent-300" : "text-accent-700 dark:text-accent-500"
            }
          >
            Haven
          </span>
        </span>
        <span
          className={`text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${light ? "text-primary-100" : "text-slate-600 dark:text-slate-400"}`}
        >
          Veterinary Clinic
        </span>
      </span>
    </Link>
  );
}
