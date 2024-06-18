"use server"
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import fetchUserData from "./fetchUserData";
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
        const userData = await fetchUserData();
        console.log(`UserData: ${userData._id}`)
        console.log(`postId: ${props.postId}`);
        console.log(`Increment: ${increment}`);
        const updateOperation: { $inc: { likes: number }, $push?: { liked_by?: ObjectId }, $pull?: { liked_by?: ObjectId } } = props.like
            ? { $inc: { likes: increment }, $push: { liked_by: userData._id } }
            : { $inc: { likes: increment }, $pull: { liked_by: userData._id } };

        const updatedPost = await Postcollection.findOneAndUpdate(
            { _id: new ObjectId(props.postId) },
            updateOperation as any,
            { returnDocument: 'after' }
        );

        if (!updatedPost) {
            throw new Error("Post not found");
        }
        console.log(`Updated likes: ${JSON.stringify(updatedPost)}`);
        return JSON.parse(JSON.stringify({ "likes": updatedPost?.likes, "dislikes": updatedPost?.dislikes, "liked_by": updatedPost?.liked_by }));
    }
    catch (e) {
        throw new Error(`Error while liking a post ${e}`);
    }
}
const DislikePost = async (props: DislikePostTypes) => {
    try {
        console.log(props);
        const client = await clientPromise;
        const db = client.db();
        const Postcollection = db.collection('posts');
        const increment = props.dislike ? 1 : -1;
        const userData = await fetchUserData();
        console.log(`UserData: ${userData._id}`);
        console.log(`postId: ${props.postId}`);
        console.log(`Increment: ${increment}`);

        const updateOperation: {
            $inc: { dislikes: number };
            $push?: { disliked_by?: ObjectId };
            $pull?: { disliked_by?: ObjectId };
        } = props.dislike
                ? { $inc: { dislikes: increment }, $push: { disliked_by: userData._id } }
                : { $inc: { dislikes: increment }, $pull: { disliked_by: userData._id } };

        const updatedPost = await Postcollection.findOneAndUpdate(
            { _id: new ObjectId(props.postId) },
            updateOperation as any,
            { returnDocument: 'after' }
        );

        if (!updatedPost) {
            throw new Error("Post not found");
        }

        console.log(`Updated dislikes: ${JSON.stringify(updatedPost)}`);
        return JSON.parse(
            JSON.stringify({
                likes: updatedPost?.likes,
                dislikes: updatedPost?.dislikes,
                disliked_by: updatedPost?.disliked_by,
            })
        );
    } catch (e) {
        throw new Error(`Error while disliking a post ${e}`);
    }
};
export { LikePost, DislikePost };