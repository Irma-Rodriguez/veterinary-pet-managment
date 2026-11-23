-- PawHaven Veterinary Clinic: database schema (PostgreSQL 13+).
-- Safe to run more than once: every statement uses IF NOT EXISTS.
-- Run it with `npm run db:seed` (see README).

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone         VARCHAR(20),
  role          VARCHAR(20) NOT NULL DEFAULT 'owner'
                CHECK (role IN ('owner', 'vet', 'receptionist', 'admin')),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  species       VARCHAR(30) NOT NULL
                CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
  breed         VARCHAR(100),
  sex           VARCHAR(10) CHECK (sex IN ('male', 'female', 'unknown')),
  date_of_birth DATE,
  weight_kg     NUMERIC(5, 2) CHECK (weight_kg > 0),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pets_owner_id_idx ON pets(owner_id);

CREATE TABLE IF NOT EXISTS veterinarians (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID UNIQUE REFERENCES users(id),
  name      VARCHAR(100) NOT NULL,
  specialty VARCHAR(100),
  bio       TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id          UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  veterinarian_id UUID NOT NULL REFERENCES veterinarians(id),
  booked_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  reason          VARCHAR(255) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('scheduled', 'completed', 'canceled')),
  vet_notes       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS appointments_pet_id_idx ON appointments(pet_id);
CREATE INDEX IF NOT EXISTS appointments_vet_day_idx
  ON appointments(veterinarian_id, scheduled_at);

-- Blocks double booking: a vet can't have two scheduled appointments at the
-- same time. Canceled appointments free the slot again.
CREATE UNIQUE INDEX IF NOT EXISTS appointments_vet_slot_unique
  ON appointments(veterinarian_id, scheduled_at)
  WHERE status = 'scheduled';
