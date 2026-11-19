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

| Variable        | What it is                                                                       |
| --------------- | -------------------------------------------------------------------------------- |
| `POSTGRES_URL`  | Database connection string, e.g. `postgresql://user:password@host:5432/pawhaven` |
| `SEED_PASSWORD` | Password for all demo accounts (at least 8 characters)                           |

`.env.local` is ignored by git. Never commit real passwords.

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

## Team Members

- Jairo Castro Castillo
- Manuela Rodriguez Cardenas
- Valeria Rodriguez Cardenas
