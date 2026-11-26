import "server-only";
import { sql } from "../db";
import type { Role, User } from "../definitions";

// Columns that are safe to return. Never select password_hash here.
type UserRow = User;

export async function findUserById(id: string): Promise<User | null> {
  const [user] = await sql<UserRow[]>`
    SELECT id, name, email, phone, role, is_active
    FROM users
    WHERE id = ${id}
  `;
  return user ?? null;
}

// Only used to check a password at sign-in.
export async function findUserWithPasswordByEmail(email: string) {
  const [user] = await sql<(UserRow & { passwordHash: string })[]>`
    SELECT id, name, email, phone, role, is_active, password_hash
    FROM users
    WHERE email = ${email}
  `;
  return user ?? null;
}

export async function emailExists(email: string) {
  const [row] = await sql<{ exists: boolean }[]>`
    SELECT EXISTS (SELECT 1 FROM users WHERE email = ${email}) AS exists
  `;
  return row.exists;
}

// Public registration: the role is always 'owner' and never comes from input.
export async function createOwner(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  const role: Role = "owner";
  const [user] = await sql<UserRow[]>`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${input.name}, ${input.email}, ${input.passwordHash}, ${role})
    RETURNING id, name, email, phone, role, is_active
  `;
  return user;
}
