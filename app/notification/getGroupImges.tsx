"use server"
import { getMongoClient } from "@/lib/db"
import { ObjectId } from 'mongodb';

export default async function getGroupImages(userIds: string[]) {
    const client = await getMongoClient();
    const db = client.db();
    const UserCollection = db.collection("users");

    const users = await UserCollection.find(
        { _id: { $in: userIds.map(id => new ObjectId(id)) } },
        { projection: { image: 1 } }
    ).toArray();

    const imageUrls = users.map(user => user.image);

    return imageUrls;
}