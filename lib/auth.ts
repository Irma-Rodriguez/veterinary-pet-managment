import "server-only";
import bcrypt from "bcryptjs";
import { LoginSchema, RegisterSchema, type User } from "./definitions";
import {
  createOwner,
  emailExists,
  findUserWithPasswordByEmail,
} from "./data/users";

// Business logic for sign-up and sign-in, used by the API Route Handlers.
// It doesn't touch cookies: the route handler creates the session.

export type FieldErrors = Record<string, string[] | undefined>;

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; status: number; message: string; fieldErrors?: FieldErrors };

const GENERIC_LOGIN_ERROR = "Invalid email or password.";

// Used when the email doesn't exist, so a wrong email takes as long as a
// wrong password (doesn't reveal which emails are registered).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

function zodFieldErrors(error: {
  issues: { path: PropertyKey[]; message: string }[];
}) {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}

export async function registerOwner(input: unknown): Promise<AuthResult> {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { name, email, password } = parsed.data;

  if (await emailExists(email)) {
    return {
      ok: false,
      status: 409,
      message: "Please fix the errors below.",
      fieldErrors: { email: ["An account with this email already exists."] },
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await createOwner({ name, email, passwordHash });
    return { ok: true, user };
  } catch (error) {
    // Two sign-ups with the same email at the same time: the UNIQUE
    // constraint rejects the second one (Postgres error 23505).
    if ((error as { code?: string }).code === "23505") {
      return {
        ok: false,
        status: 409,
        message: "Please fix the errors below.",
        fieldErrors: { email: ["An account with this email already exists."] },
      };
    }
    throw error;
  }
}

export async function authenticate(input: unknown): Promise<AuthResult> {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { email, password } = parsed.data;
  const found = await findUserWithPasswordByEmail(email);
  const passwordMatches = await bcrypt.compare(
    password,
    found?.passwordHash ?? DUMMY_HASH,
  );

  // Same message for unknown email, wrong password, or deactivated account.
  if (!found || !passwordMatches || !found.isActive) {
    return { ok: false, status: 401, message: GENERIC_LOGIN_ERROR };
  }

  const { passwordHash: _omit, ...user } = found;
  void _omit;
  return { ok: true, user };
}
