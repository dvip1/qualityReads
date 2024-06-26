"use server"
import { ObjectId } from 'mongodb';
import clientPromise from "@/lib/db";
import fetchUserData from "./fetchUserData";
interface PostList {
    page: number
    limit: number
    category?: string
    tags?: string[]
    usersPost?: boolean
    likedByUser?: boolean
    dislikedByUser?: boolean
    sortBy?: 'liked' | 'recent' | 'disliked';
}
interface Query {
    category?: string;
    tags?: { $in: string[] };
    user_id?: ObjectId;
    liked_by?: ObjectId;
    disliked_by?: ObjectId;
}

const FetchFilterData = async (filters: PostList) => {
    try {
        //Init
        const CurrentUserData = await fetchUserData();
        const client = await clientPromise;
        const db = client.db();
        const UserCollection = db.collection("users");
        const PostCollection = db.collection("posts");

        const query: Query = {};

        if (filters.category) query.category = filters.category;
        if (filters.tags) query.tags = { $in: filters.tags };
        if (filters.usersPost) query.user_id = new ObjectId(CurrentUserData._id);
        if (filters.likedByUser) query.liked_by = new ObjectId(CurrentUserData._id);
        if (filters.dislikedByUser) query.disliked_by = new ObjectId(CurrentUserData._id);

        // Fetch the user document with the given _id
        const user = await UserCollection.findOne({ _id: new ObjectId(CurrentUserData._id) });

        // If the user document or the myList field does not exist, return null
        if (!user || !user.myList) {
            return null;
        }

        const posts = await PostCollection.find(query)
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .skip(filters.limit * (filters.page - 1)) // Calculate the number of documents to skip for pagination
            .limit(filters.limit)
            .toArray();
        const currentUser = await UserCollection.findOne({ _id: new ObjectId(CurrentUserData._id) });
        const totalPostsCount = await PostCollection.countDocuments(query);
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const user = await UserCollection.findOne({ _id: post.user_id }, { projection: { name: 1, image: 1 } });
            console.log(`Logging user data: ${JSON.stringify(currentUser?.myList, currentUser?.myList?.includes(post._id))}`);
            console.log(`UserLiked: ${JSON.stringify(post.liked_by)}`);
            return {
                user: user ? { name: user.name, image: user.image } : { name: '', image: '' },
                url: post.url,
                title: post.title,
                tags: post.tags,
                likes: post.likes,
                dislikes: post.dislikes,
                userLiked: post.liked_by.includes(CurrentUserData._id),
                userDisliked: post.disliked_by.includes(CurrentUserData._id),
                content: post.content,
                postId: post._id,
                isPostInList: currentUser?.myList?.includes(post._id) ?? false
            };
        }));
        console.log(postsWithUserData);
        return JSON.parse(JSON.stringify({ posts: postsWithUserData, total: totalPostsCount }));
    }
    catch (e) {
        throw new Error(`Error occured while fetching user posts: ${e}`);
    }
}
export default FetchFilterData;