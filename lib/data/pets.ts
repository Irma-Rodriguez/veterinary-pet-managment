import "server-only";
import { sql } from "@/lib/db";
import type { Pet } from "@/lib/definitions";

export async function getPetsByOwner(ownerId: string): Promise<Pet[]> {
    return sql<Pet[]>`
        SELECT *
        FROM pets
        WHERE owner_id = ${ownerId}
        ORDER BY created_at DESC
    `;
}

export async function getPetById(
    petId: string,
    ownerId: string
): Promise<Pet | null> {
    const [pet] = await sql<Pet[]>`
        SELECT *
        FROM pets
        WHERE id = ${petId}
          AND owner_id = ${ownerId}
    `;

    return pet ?? null;
}
