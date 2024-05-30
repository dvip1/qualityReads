import clientPromise from '@/lib/db'

export async function GET(req: Request) {
    try {
        const data = req.body;
        console.log(data);
        return Response.json({ "message": "this is messasge" });
    } catch (err) {
        console.error('Error:', err)
    }
}
