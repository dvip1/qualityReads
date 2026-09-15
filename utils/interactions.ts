"use server"
import { getMongoClient } from "@/lib/db";
import { ObjectId } from "mongodb";
import fetchUserData from "./fetchUserData";
import Trending from "@/lib/Trending";
import { getRedisClient } from "@/lib/redis";
import { saveNotification, publishNotification } from "@/lib/notifications";

export interface LikePostTypes {
    like: boolean
    postId: ObjectId
};
export interface DislikePostTypes {
    dislike: boolean
    postId: ObjectId
}
const LikePost = async (props: LikePostTypes) => {
    try {
        if (!props.postId) return null;
        const client = await getMongoClient();
        const db = client.db();
        const Postcollection = db.collection('posts');
        const redisClient = getRedisClient();
        const TrendingObject = new Trending(redisClient);
        await updateTrendingScore(TrendingObject, props);
        const user = await getUserById(Postcollection, props.postId.toString());
        const ownerId = user?.user_id ? user.user_id.toString() : null;
        if (!ownerId) {
            console.warn(`Post ${props.postId} has no owner; skipping like`);
            return null;
        }
        const userData = await fetchUserData();
        await sendNotification(ownerId, props.postId.toString(), userData._id);
        const updateOperation = await getUpdateOperation(Postcollection, props, userData._id, ownerId);
        const updatedPost = await updatePost(Postcollection, props.postId.toString(), updateOperation);

        return formatResponse(updatedPost);
    } catch (e) {
        console.error(`Error while liking a post ${e}`);
    }
};

const updateTrendingScore = async (TrendingObject: Trending, props: LikePostTypes) => {
    if (props.like) {
        await TrendingObject.updatePostScore("trending_daily", props.postId.toString());

    } else {
        await TrendingObject.unlikePost("trending_daily", props.postId.toString());
    }
};

const getUserById = async (Postcollection: any, postId: string) => {
    return await Postcollection.findOne(
        { _id: new ObjectId(postId) },
        { projection: { user_id: 1 } }
    );
};

const sendNotification = async (userId: string, postId: string, metaId: ObjectId) => {
    const NotificationData = {
        userId: userId,
        postId: postId,
        message: "User Liked Your Post",
        metaId: metaId.toString(),
        type: "liked"
    };
    await saveNotification(NotificationData);
};

const getUpdateOperation = async (Postcollection: any, props: LikePostTypes, likerId: ObjectId, ownerId: string) => {
    const post = await Postcollection.findOne({ _id: new ObjectId(props.postId) });
    const isLiked = post?.liked_by?.includes(likerId);

    if (isLiked) {
        return { $inc: { likes: -1 }, $pull: { liked_by: likerId } };
    } else {
        // Nudge the post owner's open tabs. Fire-and-forget by design.
        void publishNotification(ownerId, { type: "liked", postId: props.postId.toString() });
        return { $inc: { likes: 1 }, $push: { liked_by: likerId } };
    }
};

const updatePost = async (Postcollection: any, postId: string, updateOperation: any) => {
    try {
        const result = await Postcollection.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            updateOperation,
            { returnDocument: 'after' }
        );
        if (!result) {
            throw new Error("Post not found");
        }
        return result;
    } catch (error) {
        console.error(`An error occured ${error}`);
        throw new Error(`An error occured while updating post: ${error}`);
    }

};

const formatResponse = (updatedPost: any) => {
    return JSON.parse(JSON.stringify({
        likes: updatedPost.likes,
        dislikes: updatedPost.dislikes,
        liked_by: updatedPost.liked_by
    }));
};


const DislikePost = async (props: DislikePostTypes) => {
    try {
        if (!props.postId) return null;

        const client = await getMongoClient();
        const db = client.db();
        const Postcollection = db.collection('posts');
        const userData = await fetchUserData();
        const updateOperation = await getDislikeUpdateOperation(Postcollection, props, userData._id);
        const updatedPost = await updatePost(Postcollection, props.postId.toString(), updateOperation);

        return formatResponse(updatedPost);
    } catch (e) {
        throw new Error(`Error while disliking a post ${e}`);
    }
};

const getDislikeUpdateOperation = async (Postcollection: any, props: DislikePostTypes, userId: ObjectId) => {
    const post = await Postcollection.findOne({ _id: new ObjectId(props.postId) });
    const isDisliked = post?.disliked_by?.includes(userId);

    if (!isDisliked) {
        return { $inc: { dislikes: 1 }, $push: { disliked_by: userId } };
    } else {
        return { $inc: { dislikes: -1 }, $pull: { disliked_by: userId } };
    }
};



export default DislikePost;
export { LikePost, DislikePost };