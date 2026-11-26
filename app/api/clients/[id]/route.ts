import { z } from "zod";
import { getApiUser } from "@/lib/dal";
import { getClientById, updateClient } from "@/lib/data/clients";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const clientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().trim().max(30).nullable(),
  ),
});

// GET /api/clients/[id]
export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await getApiUser("admin", "receptionist");

  if ("status" in auth) {
    return Response.json({ message: "Unauthorized" }, { status: auth.status });
  }

  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    return Response.json({ message: "Client not found" }, { status: 404 });
  }

  return Response.json({ client });
}

// PATCH /api/clients/[id]
export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await getApiUser("admin", "receptionist");

  if ("status" in auth) {
    return Response.json({ message: "Unauthorized" }, { status: auth.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const validation = clientSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      {
        message: "Please check the client information.",
        errors: validation.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const client = await updateClient({
    id,
    name: validation.data.name,
    phone: validation.data.phone,
  });

  if (!client) {
    return Response.json({ message: "Client not found" }, { status: 404 });
  }

  return Response.json({
    message: "Client updated successfully.",
    client,
  });
}
