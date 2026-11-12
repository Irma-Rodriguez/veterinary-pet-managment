import Link from "next/link";
import { StatusBadge } from "@/components/appointments/StatusBadge";
import { PawIcon } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { clinic, services, team, type ServiceIcon } from "@/lib/clinic";

const iconPaths: Record<ServiceIcon, React.ReactNode> = {
  stethoscope: (
    <>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M10 12v3a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="11" r="2" />
    </>
  ),
  syringe: (
    <>
      <path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a2 2 0 0 1-2.8 0l-1.2-1.2a2 2 0 0 1 0-2.8L15 5" />
      <path d="m9 11 4 4M5 19l-3 3M14 4l6 6" />
    </>
  ),
  scalpel: (
    <>
      <path d="M3 21 14.5 9.5" />
      <path d="M14.5 9.5 19 5a2.1 2.1 0 0 1 3 3l-4.5 4.5Z" />
    </>
  ),
  tooth: (
    <path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 3 1 6.5 3 6.5s2-4 4-4 2 4 4 4 2.5-3.5 3-6.5c.5-2.5 2-4 2-7C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z" />
  ),
  skin: (
    <>
      <path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11Z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  feather: (
    <>
      <path d="M20.2 12.2A6 6 0 0 0 11.8 3.8L5 10.6V19h8.4Z" />
      <path d="M16 8 2 22M17.5 15H9" />
    </>
  ),
};

function ServiceIconSvg({ name }: { name: ServiceIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-6"
    >
      {iconPaths[name]}
    </svg>
  );
}

function initials(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

const steps = [
  {
    title: "Create your account",
    text: "Sign up as a pet owner with your name and email.",
  },
  {
    title: "Add your pets",
    text: "Register each pet with its species, breed, and notes.",
  },
  {
    title: "Book a visit",
    text: "Choose a veterinarian and a free time. We'll see you soon!",
  },
];

const sampleAppointments = [
  {
    pet: "Luna",
    species: "Dog",
    vet: "Dr. Ramírez",
    date: "Nov 18 · 10:30 AM",
    status: "scheduled" as const,
  },
  {
    pet: "Milo",
    species: "Cat",
    vet: "Dr. Chen",
    date: "Nov 4 · 3:00 PM",
    status: "completed" as const,
  },
  {
    pet: "Kiwi",
    species: "Bird",
    vet: "Dr. Martins",
    date: "Oct 29 · 9:00 AM",
    status: "canceled" as const,
  },
];

const sectionTitle =
  "font-heading text-3xl font-bold text-primary-900 dark:text-primary-100";
const card =
  "rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900";
const infoCard = "rounded-xl border border-slate-200 p-6 dark:border-slate-800";
const h3 = "font-heading text-lg font-bold text-slate-900 dark:text-slate-100";
const muted = "text-slate-600 dark:text-slate-400";
const inlineLink =
  "font-semibold text-primary-700 underline-offset-4 hover:underline dark:text-primary-300";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-slate-50 dark:from-primary-950 dark:to-slate-950">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-sm font-semibold text-accent-700 dark:bg-accent-950 dark:text-accent-300">
              <PawIcon className="size-4" />
              {clinic.name}
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-primary-900 md:text-5xl dark:text-primary-100">
              {clinic.tagline}
            </h1>
            <p className={`mt-4 max-w-lg text-lg ${muted}`}>
              Friendly veterinarians, modern care, and online booking. Keep your
              pets&apos; records in one place and book their next visit in under
              a minute.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register">Book an appointment</ButtonLink>
              <ButtonLink href={`tel:${clinic.phone}`} variant="secondary">
                Call {clinic.phone}
              </ButtonLink>
            </div>
            <p className={`mt-4 text-sm ${muted}`}>
              Already a client?{" "}
              <Link href="/login" className={inlineLink}>
                Sign in
              </Link>
            </p>
          </div>

          {/* Preview card: shows what owners get after signing in */}
          <div className={card} aria-label="Example of an owner's appointments">
            <div className="mb-4 flex items-center justify-between">
              <h2 className={h3}>Your appointments, online</h2>
              <span className={`text-sm ${muted}`}>Example</span>
            </div>
            <ul className="space-y-3">
              {sampleAppointments.map((a) => (
                <li
                  key={a.pet}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                    <PawIcon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {a.pet}{" "}
                      <span className={`font-normal ${muted}`}>
                        · {a.species}
                      </span>
                    </p>
                    <p className={`truncate text-sm ${muted}`}>
                      {a.vet} · {a.date}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:px-6"
      >
        <div className="text-center">
          <h2 className={sectionTitle}>Our services</h2>
          <p className={`mx-auto mt-3 max-w-xl ${muted}`}>
            Everything your pet needs, from the first vaccine to senior care.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className={card}>
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                <ServiceIconSvg name={s.icon} />
              </span>
              <h3 className={h3}>{s.title}</h3>
              <p className={`mt-2 ${muted}`}>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Team (static for now; will come from the veterinarians table) */}
      <section id="team" className="scroll-mt-20 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="text-center">
            <h2 className={sectionTitle}>Meet our veterinarians</h2>
            <p className={`mx-auto mt-3 max-w-xl ${muted}`}>
              Choose the veterinarian you prefer when you book online.
            </p>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((vet) => (
              <li
                key={vet.name}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-950"
              >
                <span
                  aria-hidden="true"
                  className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-700 font-heading text-2xl font-extrabold text-white ring-4 ring-accent-100 dark:ring-accent-950"
                >
                  {initials(vet.name)}
                </span>
                <h3 className={`mt-4 ${h3}`}>{vet.name}</h3>
                <p className="text-sm font-semibold text-accent-700 dark:text-accent-300">
                  {vet.specialty}
                </p>
                <p className={`mt-2 text-sm ${muted}`}>{vet.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How online booking works */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`${sectionTitle} text-center`}>
          Book online in 3 steps
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-100 font-heading text-lg font-extrabold text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                {i + 1}
              </span>
              <div>
                <h3 className={h3}>{s.title}</h3>
                <p className={`mt-1 ${muted}`}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Visit us */}
      <section id="visit" className="scroll-mt-20 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className={`${sectionTitle} text-center`}>Visit us</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className={infoCard}>
              <h3 className={h3}>Address</h3>
              <address className={`mt-2 not-italic ${muted}`}>
                {clinic.address.street}
                <br />
                {clinic.address.city}, {clinic.address.region}
              </address>
            </div>
            <div className={infoCard}>
              <h3 className={h3}>Opening hours</h3>
              <dl className={`mt-2 space-y-1 ${muted}`}>
                {clinic.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt>{h.days}</dt>
                    <dd className="text-right font-semibold text-slate-900 dark:text-slate-100">
                      {h.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={infoCard}>
              <h3 className={h3}>Contact</h3>
              <ul className={`mt-2 space-y-1 ${muted}`}>
                <li>
                  Phone:{" "}
                  <a href={`tel:${clinic.phone}`} className={inlineLink}>
                    {clinic.phone}
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a href={`mailto:${clinic.email}`} className={inlineLink}>
                    {clinic.email}
                  </a>
                </li>
              </ul>
              <p className="mt-4 rounded-lg bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-200">
                Emergencies 24/7: {clinic.emergencyPhone}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-xl bg-primary-700 px-6 py-12 text-center text-white dark:bg-primary-900">
          <h2 className="font-heading text-3xl font-bold">
            Ready for your pet&apos;s next visit?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-100">
            Create your free owner account, add your pets, and book with the
            veterinarian you prefer.
          </p>
          <ButtonLink href="/register" variant="accent" className="mt-8">
            Create my account
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
