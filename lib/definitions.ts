import { z } from "zod";

// ---------- Shared types (camelCase, matching the rows from lib/db.ts) ----------

export const ROLES = ["owner", "vet", "receptionist", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const SPECIES = ["dog", "cat", "bird", "rabbit", "other"] as const;
export type Species = (typeof SPECIES)[number];

export const APPOINTMENT_STATUSES = [
  "scheduled",
  "completed",
  "canceled",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

// Start page for each role after signing in.
export const HOME_BY_ROLE: Record<Role, string> = {
  owner: "/pets",
  vet: "/schedule",
  receptionist: "/front-desk",
  admin: "/admin/staff",
};

export type SessionPayload = {
  userId: string;
  role: Role;
  expiresAt: Date;
};

// Never includes the password hash.
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
};

export type Pet = {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string | null;
  sex: "male" | "female" | "unknown" | null;
  dateOfBirth: Date | null;
  weightKg: string | null; // NUMERIC comes back as a string to keep precision
  notes: string | null;
};

export type Veterinarian = {
  id: string;
  userId: string | null;
  name: string;
  specialty: string | null;
  bio: string | null;
  isActive: boolean;
};

export type Appointment = {
  id: string;
  petId: string;
  veterinarianId: string;
  bookedBy: string | null;
  scheduledAt: Date;
  reason: string;
  status: AppointmentStatus;
  vetNotes: string | null;
};

// ---------- Validation schemas (used on the server for every form) ----------

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address." }));

// Public registration. There is intentionally NO `role` field:
// every self-registered account is an owner.
export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(100, { error: "Name must be 100 characters or less." }),
  email,
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(72, { error: "Password must be 72 characters or less." })
    .regex(/[a-zA-Z]/, { error: "Password must contain a letter." })
    .regex(/[0-9]/, { error: "Password must contain a number." }),
});

export const LoginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Enter your password." }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
