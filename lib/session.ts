import "server-only";
import { cookies } from "next/headers";
import type { Role } from "./definitions";
import { SESSION_COOKIE, decrypt, encrypt } from "./session-token";

// Stateless session: a signed JWT in an httpOnly cookie.
// It only stores the user id and role (never email, phone, or passwords).
// Based on node_modules/next/dist/docs/01-app/02-guides/authentication.md

const SESSION_DAYS = 7;

export async function createSession(userId: string, role: Role) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const token = await encrypt({ userId, role, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Browsers only send secure cookies over https; localhost uses http.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readSession() {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(SESSION_COOKIE)?.value);
}
