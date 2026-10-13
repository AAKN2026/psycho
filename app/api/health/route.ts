export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { status: "ok", service: "persona", mode: "demo" },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
