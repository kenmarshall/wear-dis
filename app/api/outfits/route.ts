import { getOutfits } from "@/lib/claude";
import { OutfitsRequestSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = OutfitsRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await getOutfits(parsed.data);
    return Response.json(result);
  } catch (error) {
    console.error("[api/outfits]", error);
    return Response.json({ error: "advisor_failed" }, { status: 500 });
  }
}
