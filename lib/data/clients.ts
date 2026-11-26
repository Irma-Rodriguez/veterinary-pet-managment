import "server-only";
import { sql } from "../db";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  petsCount: number;
};

// Get all registered pet owners and their number of pets.
export async function getClients(): Promise<Client[]> {
  return sql<Client[]>`
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      COUNT(p.id)::int AS "petsCount"
    FROM users u
    LEFT JOIN pets p ON p.owner_id = u.id
    WHERE u.role = 'owner'
    GROUP BY u.id, u.name, u.email, u.phone
    ORDER BY u.name ASC
  `;
}

// Get the total number of clients and their pets.
export async function getClientsSummary(): Promise<{
  totalClients: number;
  totalPets: number;
}> {
  const [summary] = await sql<
    {
      totalClients: number;
      totalPets: number;
    }[]
  >`
    SELECT
      COUNT(DISTINCT u.id)::int AS "totalClients",
      COUNT(p.id)::int AS "totalPets"
    FROM users u
    LEFT JOIN pets p ON p.owner_id = u.id
    WHERE u.role = 'owner'
  `;

  return summary;
}

// Get one client by ID.
export async function getClientById(id: string) {
  const [client] = await sql<
    {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    }[]
  >`
    SELECT id, name, email, phone
    FROM users
    WHERE id = ${id}
      AND role = 'owner'
  `;

  return client ?? null;
}

// Update a client's editable information.
export async function updateClient(input: {
  id: string;
  name: string;
  phone: string | null;
}) {
  const [client] = await sql<
    {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    }[]
  >`
    UPDATE users
    SET
      name = ${input.name},
      phone = ${input.phone},
      updated_at = now()
    WHERE id = ${input.id}
      AND role = 'owner'
    RETURNING id, name, email, phone
  `;

  return client ?? null;
}
