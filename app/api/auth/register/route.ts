import { registerOwner } from "@/lib/auth";
import { HOME_BY_ROLE } from "@/lib/definitions";
import { createSession } from "@/lib/session";

// POST /api/auth/register
// Body (JSON): { name, email, password, confirmPassword }
// Always creates an "owner". A "role" field in the body is ignored.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await registerOwner(body);

  if (!result.ok) {
    return Response.json(
      { message: result.message, fieldErrors: result.fieldErrors },
      { status: result.status },
    );
  }

  await createSession(result.user.id, result.user.role);
  return Response.json(
    {
      user: { name: result.user.name, role: result.user.role },
      redirectTo: HOME_BY_ROLE[result.user.role],
    },
    { status: 201 },
  );
}
