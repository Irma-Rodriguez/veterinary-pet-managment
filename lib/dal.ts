import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { findUserById } from "./data/users";
import { HOME_BY_ROLE, type Role, type User } from "./definitions";
import { readSession } from "./session";

// Data Access Layer: the ONE place that checks who is signed in.
// Call requireRole() at the top of every private page and every private
// Route Handler. proxy.ts only does quick redirects; this is the real check.
//
// Because these functions read cookies, call them from a component that is
// inside <Suspense> (Cache Components rule).

// Signed-in user, checked against the database (so deactivated or deleted
// users are signed out). Cached for one render pass.
export const getCurrentUser = cache(async (): Promise<User> => {
  const session = await readSession();
  if (!session) redirect("/login");

  const user = await findUserById(session.userId);
  if (!user || !user.isActive) {
    // Clears the cookie, then goes to /login.
    redirect("/api/auth/logout");
  }
  return user;
});

// Use in pages: sends users with another role to their own start page.
export async function requireRole(...roles: Role[]): Promise<User> {
  const user = await getCurrentUser();
  if (!roles.includes(user.role)) {
    redirect(HOME_BY_ROLE[user.role]);
  }
  return user;
}

// Use in Route Handlers: returns null instead of redirecting, so the handler
// can answer 401/403 with JSON.
export async function getApiUser(
  ...roles: Role[]
): Promise<{ user: User } | { status: 401 | 403 }> {
  const session = await readSession();
  if (!session) return { status: 401 };
  const user = await findUserById(session.userId);
  if (!user || !user.isActive) return { status: 401 };
  if (roles.length > 0 && !roles.includes(user.role)) return { status: 403 };
  return { user };
}
