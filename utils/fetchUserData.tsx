"use server"
import { auth } from '@/auth';
import { UserTypes } from '@/app/profile/page';
import clientPromise from "@/lib/db";
import { cache } from 'react';
const fetchUserData = cache(async () => {
    try {
        const client = await clientPromise;
        const session = await auth();
        const db = client.db();
        const collection = db.collection("users");
        const UserData = await collection.findOne({ email: session?.user?.email }) as UserTypes;
        console.log(`Fetching user Data: ${UserData}`);
        return UserData;
    }
    catch (e) {
        throw new Error(`Error occured while fetching user Data: ${e}`);
    }
});
export default fetchUserData;