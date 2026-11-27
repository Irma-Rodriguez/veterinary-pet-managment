import postgres from "postgres";

// One shared connection pool for the whole app.
// In development, Next.js reloads modules on every change, so the pool is
// cached on globalThis to avoid opening new connections each time.

const url = process.env.POSTGRES_URL;
if (!url) {
  throw new Error(
    "POSTGRES_URL is not set. Copy .env.example to .env.local and add your database URL.",
  );
}

const globalForDb = globalThis as typeof globalThis & {
  sql?: postgres.Sql;
};

// - SSL comes from the URL (Neon URLs include `sslmode=require`).
// - `toCamel` turns result columns like `owner_id` into `ownerId`.
//   Write SQL in snake_case; read rows in camelCase.
export const sql =
  globalForDb.sql ??
  postgres(url, {
    transform: postgres.toCamel,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}
