import * as Ably from "ably";
import { NextRequest, NextResponse } from 'next/server';

let ablyClient: Ably.Realtime | null = null;


export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");
    const API_KEY = process.env.ABLY_API_KEY;
    if (!API_KEY || !userId) {
        return NextResponse.json({ message: "Something wrong while getting token" }, { status: 400 });
    };

    const client = new Ably.Realtime(API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: userId });
    console.log(`We got the token ${tokenRequestData}`);
    return NextResponse.json(tokenRequestData, { status: 200 });
};

function getAblyClient() {
    if (!ablyClient) {
        const API_KEY = process.env.ABLY_API_KEY;
        if (!API_KEY) {
            throw new Error('ABLY_API_KEY is not set in environment variables');
        }
        ablyClient = new Ably.Realtime(API_KEY);
    }
    return ablyClient;
}

export async function POST(req: NextRequest) {
    try {
        console.log(`[${new Date().toISOString()}] Received POST request`);

        const requestData = await req.json();
        console.log(`[${new Date().toISOString()}] Parsed request data:`, requestData);

        const { userId } = requestData;
        if (!userId) {
            console.log(`[${new Date().toISOString()}] UserId not provided`);
            return NextResponse.json({ message: 'UserId not provided' }, { status: 400 });
        }

        const client = getAblyClient();
        console.log(`[${new Date().toISOString()}] Ably client initialized`);

        const channel = client.channels.get(`notifications:${userId}`);
        console.log(`[${new Date().toISOString()}] Got channel: notifications:${userId}`);

        await channel.publish('new-notification', { message: "User Liked your post" });
        console.log(`[${new Date().toISOString()}] Published notification to channel`);

        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in Ably notification:`, error);
        return NextResponse.json({ message: `Error: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
    }
}