"use server"
import { ObjectId } from 'mongodb';
import clientPromise from "@/lib/db";
import fetchUserData from "./fetchUserData";

interface ReadingTypes {
    page: number
    limit: number
}

export default async function FetchReadingList(props: ReadingTypes) {
    try {
        const CurrentUserData = await fetchUserData();
        const client = await clientPromise;
        const db = client.db();
        const UserCollection = db.collection("users");
        const PostCollection = db.collection("posts");

        // Fetch the user document with the given _id
        const user = await UserCollection.findOne({ _id: new ObjectId(CurrentUserData._id) });

        // If the user document or the myList field does not exist, return null
        if (!user || !user.myList) {
            return null;
        }

        // Convert myList to an array of ObjectIds
        const myList = user.myList;

        // Find all posts that are in myList with pagination
        const posts = await PostCollection.find({ _id: { $in: myList } })
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .skip(props.limit * (props.page - 1)) // Calculate the number of documents to skip for pagination
            .limit(props.limit)
            .toArray();
        // Get total number of posts in myList
        const totalPosts = myList.length;
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const user = await UserCollection.findOne({ _id: post.user_id }, { projection: { name: 1, image: 1 } });
            const userLiked = !!(await PostCollection.countDocuments({ _id: post._id, liked_by: { $in: [CurrentUserData._id] } }));
            const userDisliked = !!(await PostCollection.countDocuments({ _id: post._id, disliked_by: { $in: [CurrentUserData._id] } }));
            const isPostInList: boolean = !!(await UserCollection.findOne({ _id: CurrentUserData._id, myList: { $in: [new ObjectId(post._id)] } }));
            console.log(`This is isPostInList ${isPostInList} :${CurrentUserData._id}, ${post._id} `);
            return {
                user: user ? { name: user.name, image: user.image } : { name: '', image: '' },
                url: post.url,
                title: post.title,
                tags: post.tags,
                likes: post.likes,
                dislikes: post.dislikes,
                userLiked,
                userDisliked,
                content: post.content,
                postId: post._id,
                isPostInList,
                userId: post.user_id
            };
        }));
        // Return the posts and the total number of posts
        return JSON.parse(JSON.stringify({ posts: postsWithUserData, total: totalPosts }));
    }
    catch (e) {
        throw new Error(`Error occured while fetching Reading List ${e}`);
    }
}