import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/dal";
import { sql } from "@/lib/db";
import { z } from "zod";

const CreatePetSchema = z.object({
    name: z.string().trim().min(1).max(100),
    species: z.enum(["dog", "cat", "bird", "rabbit", "other"]),
    breed: z.string().trim().max(100).optional().or(z.literal("")),
    sex: z.enum(["male", "female", "unknown"]),
    dateOfBirth: z.iso.date().optional().or(z.literal("")),
    weightKg: z.coerce.number().positive().max(999.99).optional(),
    notes: z.string().max(500).optional(),
});

export async function POST(request: Request) {
    try {
        // Verify that the user is authenticated and has the owner role.
        const auth = await getApiUser("owner");

        if ("status" in auth) {
            return NextResponse.json(
                { error: "Unauthorized or insufficient permissions." },
                { status: auth.status },
            );
        }

        const body: unknown = await request.json();
        const parsed = CreatePetSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Please check the pet information." },
                { status: 400 },
            );
        }

        const data = parsed.data;

        const [pet] = await sql`
      INSERT INTO pets (
        owner_id,
        name,
        species,
        breed,
        sex,
        date_of_birth,
        weight_kg,
        notes
      )
      VALUES (
        ${auth.user.id},
        ${data.name},
        ${data.species},
        ${data.breed || null},
        ${data.sex},
        ${data.dateOfBirth || null},
        ${data.weightKg ?? null},
        ${data.notes || null}
      )
      RETURNING *
    `;

        return NextResponse.json({ pet }, { status: 201 });
    } catch (error) {
        console.error("Create pet error:", error);

        return NextResponse.json(
            { error: "An unexpected error occurred while saving the pet." },
            { status: 500 },
        );
    }
}