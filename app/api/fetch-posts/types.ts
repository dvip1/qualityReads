import { ObjectId } from "mongodb";
export interface PostList {
    page: number;
    limit: number;
    category?: string;
    tags?: string[];
    usersPost?: boolean;
    likedByUser?: boolean;
    dislikedByUser?: boolean;
    sortBy?: "liked" | "recent" | "disliked";
    postIdInArray: string[];
    givenPostId: string;
};
export interface Query {
    category?: string;
    tags?: { $in: string[] };
    user_id?: ObjectId;
    liked_by?: ObjectId;
    disliked_by?: ObjectId;
    _id?: ObjectId | { $in: ObjectId[] }; // Allow _id to be either an ObjectId or have the $in operator with an array of ObjectId
};
