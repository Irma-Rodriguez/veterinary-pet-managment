import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser } from "@/lib/dal";
import { sql } from "@/lib/db";

const UpdatePetSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),

    species: z.enum(["dog", "cat", "bird", "rabbit", "other"]).optional(),

    breed: z.string().trim().max(100).nullable().optional(),

    sex: z.enum(["male", "female", "unknown"]).nullable().optional(),

    dateOfBirth: z.preprocess(
        (value) => value === "" ? null : value,
        z.union([z.iso.date(), z.null()])
    ).optional(),

    weightKg: z.preprocess(
        (value) => value === "" ? null : value,
        z.union([
            z.coerce.number().positive().max(999.99),
            z.null()
        ])
    ).optional(),

    notes: z.string().max(500).nullable().optional(),
});

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getApiUser("owner");

        if ("status" in auth) {
            return NextResponse.json(
                { error: "Unauthorized or insufficient permissions." },
                { status: auth.status }
            );
        }

        const { id } = await params;

        const body: unknown = await request.json();
        const parsed = UpdatePetSchema.safeParse(body);

        if (!parsed.success || Object.keys(parsed.data).length === 0) {
            return NextResponse.json(
                { error: "Please provide valid pet information." },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const [pet] = await sql`
            UPDATE pets
            SET
                name = CASE WHEN ${data.name !== undefined}
                    THEN ${data.name ?? null} ELSE name END,

                species = CASE WHEN ${data.species !== undefined}
                    THEN ${data.species ?? null} ELSE species END,

                breed = CASE WHEN ${data.breed !== undefined}
                    THEN ${data.breed ?? null} ELSE breed END,

                sex = CASE WHEN ${data.sex !== undefined}
                    THEN ${data.sex ?? null} ELSE sex END,

                date_of_birth = CASE WHEN ${data.dateOfBirth !== undefined}
                    THEN ${data.dateOfBirth ?? null}::date ELSE date_of_birth END,

                weight_kg = CASE WHEN ${data.weightKg !== undefined}
                    THEN ${data.weightKg ?? null} ELSE weight_kg END,

                notes = CASE WHEN ${data.notes !== undefined}
                    THEN ${data.notes ?? null} ELSE notes END

            WHERE id = ${id}
              AND owner_id = ${auth.user.id}

            RETURNING *
        `;

        if (!pet) {
            return NextResponse.json(
                { error: "Pet not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ pet });

    } catch (error) {
        console.error("Update pet error:", error);

        return NextResponse.json(
            { error: "An unexpected error occurred while updating the pet." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getApiUser("owner");

        if ("status" in auth) {
            return NextResponse.json(
                { error: "Unauthorized or insufficient permissions." },
                { status: auth.status }
            );
        }

        const { id } = await params;

        const [pet] = await sql`
            DELETE FROM pets
            WHERE id = ${id}
              AND owner_id = ${auth.user.id}
            RETURNING id
        `;

        if (!pet) {
            return NextResponse.json(
                { error: "Pet not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete pet error:", error);

        return NextResponse.json(
            { error: "An unexpected error occurred while deleting the pet." },
            { status: 500 }
        );
    }
}
