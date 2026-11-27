import { authenticate } from "@/lib/auth";
import { HOME_BY_ROLE, type Role } from "@/lib/definitions";
import { createSession } from "@/lib/session";

// Pages each role is allowed to be sent back to after signing in.
const ROLE_PREFIXES: Record<Role, string[]> = {
  owner: ["/pets", "/appointments", "/profile"],
  vet: ["/schedule", "/profile"],
  receptionist: ["/front-desk", "/profile"],
  admin: ["/admin", "/profile"],
};

// Only accept internal paths that belong to the user's role, so `next`
// can't send people to another site or to another role's page.
function safeRedirect(next: unknown, role: Role) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//")
  ) {
    return HOME_BY_ROLE[role];
  }
  const allowed = ROLE_PREFIXES[role].some(
    (prefix) => next === prefix || next.startsWith(`${prefix}/`),
  );
  return allowed ? next : HOME_BY_ROLE[role];
}

// POST /api/auth/login
// Body (JSON): { email, password, next? }
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await authenticate(body);

  if (!result.ok) {
    return Response.json(
      { message: result.message, fieldErrors: result.fieldErrors },
      { status: result.status },
    );
  }

  await createSession(result.user.id, result.user.role);
  return Response.json({
    user: { name: result.user.name, role: result.user.role },
    redirectTo: safeRedirect(body?.next, result.user.role),
  });
}
