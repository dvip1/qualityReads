"use server"
import clientPromise from "@/lib/db"
import fetchUserData from "./fetchUserData"
import { ObjectId, PullOperator, Document } from "mongodb";

export interface MyListTypes {
    postId: ObjectId;
}

interface PullOperatorWithObjectId extends PullOperator<Document> {
    "myList": ObjectId;
}

const AddRemoveFromList = async (props: MyListTypes) => {
    const client = await clientPromise;
    const db = client.db();
    const CurrentUserData = await fetchUserData();
    const UserCollection = db.collection("users");

    // Check if the postId is already in the "myList" array
    const user = await UserCollection.findOne({
        _id: CurrentUserData._id,
        "myList": new ObjectId(props.postId),
    });

    if (user) {
        // If the postId is already in the "myList" array, remove it
        await UserCollection.updateOne(
            { _id: CurrentUserData._id },
            { $pull: { "myList": new ObjectId(props.postId) } as PullOperatorWithObjectId }
        );
    } else {
        // If the postId is not in the "myList" array, add it
        await UserCollection.updateOne(
            { _id: CurrentUserData._id },
            { $addToSet: { "myList": new ObjectId(props.postId) } }
        );
    }
};

export default AddRemoveFromList;