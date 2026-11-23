// Creates the tables and loads demo data.
//
//   npm run db:seed    -> create missing tables and add/update demo data
//   npm run db:reset   -> DELETE ALL TABLES, then seed again (development only)
//
// Both read POSTGRES_URL and SEED_PASSWORD from .env.local.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import { team } from "../lib/clinic";
import { sql } from "../lib/db";
import type { Role } from "../lib/definitions";

const reset = process.argv.includes("--reset");
const seedPassword = process.env.SEED_PASSWORD;

if (!seedPassword || seedPassword.length < 8) {
  console.error(
    "SEED_PASSWORD must be set in .env.local (at least 8 characters).",
  );
  process.exit(1);
}

// "Dr. Laura Ramírez" -> "laura.ramirez@pawhaven.example"
function staffEmail(name: string) {
  return (
    name
      .replace("Dr. ", "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\s+/g, ".") + "@pawhaven.example"
  );
}

async function upsertUser(
  name: string,
  email: string,
  role: Role,
  passwordHash: string,
) {
  const [user] = await sql<{ id: string }[]>`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${name}, ${email}, ${passwordHash}, ${role})
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          role = EXCLUDED.role,
          password_hash = EXCLUDED.password_hash,
          is_active = true,
          updated_at = now()
    RETURNING id
  `;
  return user.id;
}

// A date `days` from today at `hour`:00 (server local time).
function dayAt(days: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  if (reset) {
    console.log("Dropping all tables...");
    await sql`DROP TABLE IF EXISTS appointments, veterinarians, pets, users CASCADE`;
  }

  console.log("Creating tables...");
  const schema = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");
  await sql.unsafe(schema).simple();

  const passwordHash = await bcrypt.hash(seedPassword!, 10);

  console.log("Adding staff accounts...");
  await upsertUser(
    "Clinic Admin",
    "admin@pawhaven.example",
    "admin",
    passwordHash,
  );
  await upsertUser(
    "Front Desk",
    "frontdesk@pawhaven.example",
    "receptionist",
    passwordHash,
  );

  const vetIds: string[] = [];
  for (const vet of team) {
    const userId = await upsertUser(
      vet.name,
      staffEmail(vet.name),
      "vet",
      passwordHash,
    );
    const [profile] = await sql<{ id: string }[]>`
      INSERT INTO veterinarians (user_id, name, specialty, bio)
      VALUES (${userId}, ${vet.name}, ${vet.specialty}, ${vet.bio})
      ON CONFLICT (user_id) DO UPDATE
        SET name = EXCLUDED.name,
            specialty = EXCLUDED.specialty,
            bio = EXCLUDED.bio,
            is_active = true
      RETURNING id
    `;
    vetIds.push(profile.id);
  }

  console.log("Adding demo owner...");
  const ownerId = await upsertUser(
    "Demo Owner",
    "owner@pawhaven.example",
    "owner",
    passwordHash,
  );

  // Pets and appointments are only added the first time, so running the
  // seed again doesn't create duplicates.
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT count(*)::int AS count FROM pets WHERE owner_id = ${ownerId}
  `;
  if (count === 0) {
    const [luna] = await sql<{ id: string }[]>`
      INSERT INTO pets (owner_id, name, species, breed, sex, date_of_birth, weight_kg, notes)
      VALUES (${ownerId}, 'Luna', 'dog', 'Golden Retriever', 'female', '2021-04-12', 28.5,
              'Allergic to chicken.')
      RETURNING id
    `;
    const [milo] = await sql<{ id: string }[]>`
      INSERT INTO pets (owner_id, name, species, breed, sex, date_of_birth, weight_kg)
      VALUES (${ownerId}, 'Milo', 'cat', 'Siamese', 'male', '2019-09-03', 4.2)
      RETURNING id
    `;

    await sql`
      INSERT INTO appointments (pet_id, veterinarian_id, booked_by, scheduled_at, reason, status, vet_notes)
      VALUES
        (${luna.id}, ${vetIds[0]}, ${ownerId}, ${dayAt(1, 10)}, 'Annual checkup', 'scheduled', NULL),
        (${milo.id}, ${vetIds[2]}, ${ownerId}, ${dayAt(3, 15)}, 'Itchy skin', 'scheduled', NULL),
        (${milo.id}, ${vetIds[0]}, ${ownerId}, ${dayAt(-10, 9)}, 'Vaccines', 'completed',
         'Rabies and FVRCP vaccines given. Next dose in one year.')
    `;
  }

  const [summary] = await sql<
    { users: number; pets: number; vets: number; appointments: number }[]
  >`
    SELECT
      (SELECT count(*)::int FROM users) AS users,
      (SELECT count(*)::int FROM pets) AS pets,
      (SELECT count(*)::int FROM veterinarians) AS vets,
      (SELECT count(*)::int FROM appointments) AS appointments
  `;
  console.log("Done:", summary);
  console.log(
    "Demo accounts (password = SEED_PASSWORD): admin@, frontdesk@, owner@, and each vet (e.g. laura.ramirez@) @pawhaven.example",
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
