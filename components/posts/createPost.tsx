"use server"
import clientPromise from '@/lib/db';
import { auth } from '@/auth';
import { UserTypes } from '@/app/profile/page';
import { ObjectId } from 'mongodb';

export interface postDataTypes {
    url: string
    title: string
    content: string
}
const CreatePost = async (postData: postDataTypes) => {
    try {
        console.log("Starting CreatePost function");
        const session = await auth();
        console.log("Session obtained:", session);
        const client = await clientPromise;
        console.log("Database client obtained");
        const db = client.db();
        const Postcollection = db.collection('posts');
        const Userscollection = db.collection('users');
        const UserData = await Userscollection.findOne({ email: session?.user?.email }) as UserTypes;
        console.log("User data obtained:", UserData);
        const user_id = UserData._id;
        const name = UserData.name;
        const image = UserData.image;

        const existingUserPosts = await Postcollection.findOne({ user_id: new ObjectId(user_id) });
        console.log("Existing user posts obtained:", existingUserPosts);

        if (existingUserPosts) {
            console.log("User already has posts, appending new post");
            const updatedPosts = [...existingUserPosts.posts, postData];
            const result = await Postcollection.updateOne(
                { user_id: new ObjectId(user_id) },
                { $set: { posts: updatedPosts } }
            );
            console.log(`Post appended for user ${user_id}`);
        } else {
            console.log("User has no posts, creating new document");
            const insertData = {
                user_id: user_id,
                name: name,
                image: image,
                posts: [postData]
            }
            const result = await Postcollection.insertOne(insertData);
            console.log(`Post inserted with _id: ${result.insertedId}`);
        }
    } catch (e) {
        console.error(`Error occurred ${e}`);
        throw new Error(`Error occurred during creating Post ${e}`)
    }
}
export default CreatePost;