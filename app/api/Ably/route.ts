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
        const requestData = await req.json();
        const { userId } = requestData;
        if (!userId) {
            return NextResponse.json({ message: 'UserId not provided' }, { status: 400 });
        }
        const client = getAblyClient();
        const channel = client.channels.get(`notifications:${userId}`);
        await channel.publish('new-notification', { message: "User Liked your post" });
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in Ably notification:`, error);
        return NextResponse.json({ message: `Error: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
    }
}