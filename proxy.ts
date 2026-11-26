import { NextResponse, type NextRequest } from "next/server";
import { HOME_BY_ROLE, type Role } from "./lib/definitions";
import { SESSION_COOKIE, decrypt } from "./lib/session-token";

// Optimistic redirects only (reads the cookie, never the database).
// The real security check is requireRole() in lib/dal.ts, on every page.
// See node_modules/next/dist/docs/01-app/02-guides/authentication.md

// Which role can open each private section. `null` = any signed-in role.
const PRIVATE_SECTIONS: { prefix: string; roles: Role[] | null }[] = [
  { prefix: "/pets", roles: ["owner"] },
  { prefix: "/appointments", roles: ["owner"] },
  { prefix: "/schedule", roles: ["vet"] },
  { prefix: "/front-desk", roles: ["receptionist"] },
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/profile", roles: null },
];

// Signed-in users don't need these pages.
const AUTH_PAGES = ["/login", "/register"];

function matches(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);

  const section = PRIVATE_SECTIONS.find((s) => matches(path, s.prefix));

  if (section) {
    if (!session) {
      const url = new URL("/login", request.nextUrl);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (section.roles && !section.roles.includes(session.role)) {
      return NextResponse.redirect(
        new URL(HOME_BY_ROLE[session.role], request.nextUrl),
      );
    }
  }

  if (session && AUTH_PAGES.includes(path)) {
    return NextResponse.redirect(
      new URL(HOME_BY_ROLE[session.role], request.nextUrl),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, Next.js internals, and files with an extension.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
