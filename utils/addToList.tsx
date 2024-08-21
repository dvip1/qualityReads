"use server"
import clientPromise from "@/lib/db"
import fetchUserData from "./fetchUserData"
import { ObjectId, PullOperator, Document } from "mongodb";
import { getRedisClient } from "@/lib/redis";
import Trending from "@/lib/Trending";
export interface MyListTypes {
    postId: ObjectId;
}

interface PullOperatorWithObjectId extends PullOperator<Document> {
    "myList": ObjectId;
}
const AddRemoveFromList = async (props: MyListTypes) => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const CurrentUserData = await fetchUserData();
        const UserCollection = db.collection("users");
        const redisClient = await getRedisClient()
        const TrendingObject = new Trending(redisClient);
        const user = await UserCollection.findOne({
            _id: CurrentUserData._id,
            "myList": new ObjectId(props.postId),
        });
        if (user) {
            await UserCollection.updateOne(
                { _id: CurrentUserData._id },
                { $pull: { "myList": new ObjectId(props.postId) } as PullOperatorWithObjectId }
            );
            await TrendingObject.unlikePost("trending_daily", props.postId.toString());
        } else {
            await UserCollection.updateOne(
                { _id: new ObjectId(CurrentUserData._id) },
                { $addToSet: { "myList": new ObjectId(props.postId) } }
            );
            await TrendingObject.updatePostScore("trending_daily", props.postId.toString())
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

export default AddRemoveFromList;