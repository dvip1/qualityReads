import clientPromise from '@/lib/db'

export async function GET(req: Request) {
    try {
        return Response.json({ "message": "this is messasge" });
    } catch (err) {
        console.error('Error:', err)
    }
}
