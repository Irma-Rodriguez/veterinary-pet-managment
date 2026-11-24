import type { Role } from "./definitions";

// Dashboard navigation for each role.
// When you build a new page (e.g. /appointments), add it here.
export const NAV_BY_ROLE: Record<Role, { href: string; label: string }[]> = {
  owner: [{ href: "/pets", label: "My pets" }],
  vet: [{ href: "/schedule", label: "My schedule" }],
  receptionist: [
    { href: "/front-desk", label: "Front desk" },
    { href: "/clients", label: "Clients" },
  ],
  admin: [
    { href: "/admin/staff", label: "Staff" },
    { href: "/clients", label: "Clients" },
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Pet owner",
  vet: "Veterinarian",
  receptionist: "Receptionist",
  admin: "Admin",
};
