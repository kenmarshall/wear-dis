import { getQuestions } from "@/lib/claude";
import { QuestionsRequestSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = QuestionsRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await getQuestions(parsed.data.event);
    return Response.json(result);
  } catch (error) {
    console.error("[api/questions]", error);
    return Response.json({ error: "advisor_failed" }, { status: 500 });
  }
}
