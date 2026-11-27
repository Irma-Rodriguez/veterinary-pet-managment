import { deleteSession } from "@/lib/session";

// POST /api/auth/logout
// Used by the "Sign out" button (a plain <form method="post">, works without JS).
export async function POST(request: Request) {
  await deleteSession();
  return Response.redirect(new URL("/", request.url), 303);
}

// GET /api/auth/logout
// Used by lib/dal.ts when a signed-in account was deactivated or deleted:
// clears the cookie and sends the user to the sign-in page.
export async function GET(request: Request) {
  await deleteSession();
  return Response.redirect(new URL("/login", request.url), 303);
}
