# Veterinary Pet Management

A web application for managing pets, veterinarians, and appointments, built as the website of the fictional **PawHaven Veterinary Clinic**.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and PostgreSQL.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

You need a PostgreSQL database (13 or newer). Use either:

- **Neon** (shared, in the cloud): create a project at [neon.tech](https://neon.tech) and copy its connection string.
- **Local PostgreSQL**: install it from [postgresql.org](https://www.postgresql.org/download/) and create an empty database, for example `pawhaven`.

Then copy the example environment file and fill in the values:

```bash
cp .env.example .env.local
```

| Variable         | What it is                                                                       |
| ---------------- | -------------------------------------------------------------------------------- |
| `POSTGRES_URL`   | Database connection string, e.g. `postgresql://user:password@host:5432/pawhaven` |
| `SEED_PASSWORD`  | Password for all demo accounts (at least 8 characters)                           |
| `SESSION_SECRET` | Secret that signs the session cookie. Generate your own (command below)          |

Generate `SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

`.env.local` is ignored by git. Never commit real passwords. Keep the three values different: the database password, the demo password, and the session secret are not the same thing.

### 3. Create the tables and demo data

```bash
npm run db:seed
```

This creates the tables from [`db/schema.sql`](db/schema.sql) and these demo accounts (all use `SEED_PASSWORD`):

| Email                            | Role                                   |
| -------------------------------- | -------------------------------------- |
| `admin@pawhaven.example`         | admin                                  |
| `frontdesk@pawhaven.example`     | receptionist                           |
| `laura.ramirez@pawhaven.example` | vet                                    |
| `daniel.okafor@pawhaven.example` | vet                                    |
| `mei.chen@pawhaven.example`      | vet                                    |
| `sofia.martins@pawhaven.example` | vet                                    |
| `owner@pawhaven.example`         | owner (with 2 pets and 3 appointments) |

Running `db:seed` again is safe: it doesn't create duplicates. To delete **everything** and start over (development only):

```bash
npm run db:reset
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Try it

1. Go to **Register** and create an account. You land on **My pets** as a pet owner.
2. Sign out, then sign in with a demo account, e.g. `laura.ramirez@pawhaven.example` + `SEED_PASSWORD`. A vet lands on **My schedule**.
3. While signed in as a vet, open `/pets`: you are sent back to `/schedule` (each role only sees its own pages).

## How authentication works

| Piece                         | File                                     | What it does                                                                                                           |
| ----------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Register / login / logout API | `app/api/auth/*/route.ts`                | Validate input, check the password, set or delete the session cookie                                                   |
| Business logic                | `lib/auth.ts`                            | `registerOwner()` and `authenticate()`. Registration **always** creates an `owner`; a `role` in the request is ignored |
| Session cookie                | `lib/session.ts`, `lib/session-token.ts` | Signed JWT (`jose`) in an `httpOnly` cookie with only the user id and role. Expires after 7 days                       |
| Quick redirects               | `proxy.ts`                               | Signed out → `/login?next=...`. Wrong role → your own start page. Never reads the database                             |
| **Real security check**       | `lib/dal.ts`                             | `requireRole()` reads the session **and** the database (deactivated users are signed out)                              |
| Forms                         | `components/auth/*`                      | Register and login forms with server-side error messages                                                               |
| Dashboard layout              | `app/(dashboard)/layout.tsx`             | Header with role-based navigation (`lib/navigation.ts`) and Sign out                                                   |

Each role's start page after signing in (`HOME_BY_ROLE` in `lib/definitions.ts`):

| Role         | Start page     |
| ------------ | -------------- |
| owner        | `/pets`        |
| vet          | `/schedule`    |
| receptionist | `/front-desk`  |
| admin        | `/admin/staff` |

## Building a new private page (for the team)

Example: the owner's appointments page at `/appointments`.

**1. Create the page** in `app/(dashboard)/appointments/page.tsx`. Because it reads the session, the content goes inside `<Suspense>` (required by Cache Components; the build fails otherwise):

```tsx
import { Suspense } from "react";
import { PageSkeleton } from "@/components/dashboard/RoleHome";
import { requireRole } from "@/lib/dal";

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AppointmentsContent />
    </Suspense>
  );
}

async function AppointmentsContent() {
  const user = await requireRole("owner"); // ALWAYS first
  // ...query the database filtering by user.id...
  return <h1>My appointments</h1>;
}
```

**2. Protect it in `proxy.ts`**: add the path to `PRIVATE_SECTIONS` if it's a new section (`/appointments` is already there).

**3. Add it to the menu** in `lib/navigation.ts` (`NAV_BY_ROLE`).

**4. For an API route**, use `getApiUser()` and answer 401/403 yourself:

```ts
import { getApiUser } from "@/lib/dal";

export async function GET() {
  const auth = await getApiUser("owner");
  if ("status" in auth) {
    return Response.json({ message: "Not allowed" }, { status: auth.status });
  }
  // auth.user is the signed-in owner. Filter every query by auth.user.id.
}
```

**Rules**

- Never trust the role or user id sent by the browser. Always use the one from `requireRole()` / `getApiUser()`.
- Filter every query by the signed-in user (e.g. `WHERE owner_id = ${user.id}`).
- Write SQL with the `sql` tagged template from `lib/db.ts`. Never build SQL by joining strings.
- Every light color class needs its `dark:` pair.

## Git workflow

- `main` is protected. Never push to it directly.
- Create a branch per task: `feature/<short-name>` (e.g. `feature/pets-list`).
- Open a Pull Request to `main`. At least one teammate reviews it before merging.
- Before opening the PR, run `npm run lint` and `npm run build`.

## Scripts

| Script             | What it does                             |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the development server             |
| `npm run build`    | Build for production                     |
| `npm run lint`     | Run ESLint                               |
| `npm run format`   | Format all files with Prettier           |
| `npm run db:seed`  | Create missing tables and load demo data |
| `npm run db:reset` | Drop all tables, then seed again         |

## Troubleshooting

- **Tailwind error about `magic-string` or `require() of ES Module`**: run `npm install`, delete the `.next` folder, and start again.
- **`POSTGRES_URL is not set`**: create `.env.local` from `.env.example` (step 2).
- **Password with special characters** (`@ : / # %`) in `POSTGRES_URL`: URL-encode them, for example `@` → `%40`.
- **`SESSION_SECRET is missing or too short`**: add it to `.env.local` (step 2) and restart `npm run dev`.
- **Demo account says "Invalid email or password"**: the accounts use the `SEED_PASSWORD` that was set when you last ran `npm run db:seed`. If you changed it, run `npm run db:seed` again.
- **Build error about `cookies()` outside `<Suspense>`**: move the code that calls `requireRole()` into a component wrapped in `<Suspense>` (see "Building a new private page").

## Team Members

- Jairo Castro Castillo
- Manuela Rodriguez Cardenas
- Valeria Rodriguez Cardenas
