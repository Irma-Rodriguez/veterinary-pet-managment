import { SignJWT, jwtVerify } from "jose";
import { ROLES, type Role, type SessionPayload } from "./definitions";

// Signs and verifies the session token (a JWT).
// Kept separate from lib/session.ts so proxy.ts can use it too.

export const SESSION_COOKIE = "session";

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. See .env.example to generate one.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(getKey());
}

// Returns null for a missing, expired, or tampered token.
export async function decrypt(
  token: string | undefined,
): Promise<{ userId: string; role: Role } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.userId !== "string" ||
      !ROLES.includes(payload.role as Role)
    ) {
      return null;
    }
    return { userId: payload.userId, role: payload.role as Role };
  } catch {
    return null;
  }
}
