// Container healthcheck target.
//
// Deliberately dependency-free: pinging Mongo or Redis here would turn a
// transient database blip into a restart loop for an otherwise healthy server,
// and would reintroduce a database call at build time.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
    return Response.json({ ok: true })
}
