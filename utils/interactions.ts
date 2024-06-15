"use server"
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
export interface LikePostTypes {
    like: boolean
    postId: ObjectId
}
const LikePost = async (props: LikePostTypes) => {
    try {
        console.log(props)
        const client = await clientPromise;
        const db = client.db();
        const Postcollection = db.collection('posts');
        const post = await Postcollection.findOne({ _id: props.postId });
        if (!post) {
            throw new Error("Post not found");
        }
        const increment = props.like ? 1 : -1;
        await Postcollection.updateOne(
            { _id: props.postId },
            { $inc: { likes: increment } }
        );
    }
    catch (e) {
        throw new Error("Error while liking a post");
    }
}
export default LikePost;