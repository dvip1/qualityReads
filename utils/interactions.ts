"use server"
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
export interface LikePostTypes {
    like: boolean
    postId: ObjectId | undefined
};
export interface DislikePostTypes {
    dislike: boolean
    postId: ObjectId | undefined
}
const LikePost = async (props: LikePostTypes) => {
    try {
        console.log(props)
        const client = await clientPromise;
        const db = client.db();
        const Postcollection = db.collection('posts');
        const increment = props.like ? 1 : -1;
        console.log(`postId: ${props.postId}`);
        console.log(`Increment: ${increment}`);
        const updatedPost = await Postcollection.findOneAndUpdate(
            { _id: new ObjectId(props.postId) },
            { $inc: { likes: increment } },
            { returnDocument: 'after' }
        );
        if (!updatedPost) {
            throw new Error("Post not found");
        }
        console.log(`Updated likes: ${JSON.stringify(updatedPost)}`);
        return JSON.parse(JSON.stringify({ "likes": updatedPost?.likes, "dislikes": updatedPost?.dislikes }));
    }
    catch (e) {
        throw new Error(`Error while liking a post ${e}`);
    }
}

const DislikePost = async (props: DislikePostTypes) => {
    try {
        console.log(props)
        const client = await clientPromise;
        const db = client.db();
        const Postcollection = db.collection('posts');
        const increment = props.dislike ? 1 : -1;
        console.log(`postId: ${props.postId}`);
        console.log(`Increment: ${increment}`);
        const updatedPost = await Postcollection.findOneAndUpdate(
            { _id: new ObjectId(props.postId) },
            { $inc: { dislikes: increment } },
            { returnDocument: 'after' }
        );
        if (!updatedPost) {
            throw new Error("Post not found");
        }
        console.log(`Updated dislikes: ${JSON.stringify(updatedPost)}`);
        return JSON.parse(JSON.stringify({ "likes": updatedPost?.likes, "dislikes": updatedPost?.dislikes }));
    }
    catch (e) {
        throw new Error(`Error while disliking a post ${e}`);
    }
}
export { LikePost, DislikePost};