import clientPromise from '@/lib/db'

export async function GET(req: Request) {
    try {
        const client = await clientPromise
        const db = client.db();
        const collection = db.collection('users');
        const data = await collection.find().toArray();
        return Response.json(data);
    } catch (err) {
        console.error('Error:', err)
    }
}
