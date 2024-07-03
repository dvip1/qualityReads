"use server"
import clientPromise from '@/lib/db';
import { auth } from '@/auth';
import { UserTypes } from '@/app/profile/page';
import { ObjectId } from 'mongodb';
import Trending from '@/utils/Trending';
import { getRedisClient } from '@/lib/redis';
export interface postDataTypes {
    url: string
    title: string
    content: string
    tags: string[]
    category: string
}

const CreatePost = async (postData: postDataTypes) => {
    try {
        console.log("Starting CreatePost function");
        const session = await auth();
        const client = await clientPromise;
        console.log("Database client obtained");
        const db = client.db();
        const Postcollection = db.collection('posts');
        const Userscollection = db.collection('users');
        const UserData = await Userscollection.findOne({ email: session?.user?.email }) as UserTypes;
        const user_id = UserData._id;
        const insertData = {
            ...postData,
            "user_id": user_id,
            "likes": 0,
            "dislikes": 0,
            "created_at": new Date(),
            "liked_by": [],
            "disliked_by": []
        }
        const redisClient = await getRedisClient()
        const TrendingObject = new Trending(redisClient);
        const result = await Postcollection.insertOne(insertData);
        const insertedPostId = result.insertedId;
        TrendingObject.addNewPost(insertedPostId.toString(), new Date());
        await TrendingObject.updateTag(postData.tags).then((e) => console.log(`something here ${e}`));
    } catch (e) {
        console.error(`Error occurred ${e}`);
        throw new Error(`Error occurred during creating Post ${e}`)
    }
}

export default CreatePost;