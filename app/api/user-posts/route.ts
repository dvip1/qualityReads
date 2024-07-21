/* Fetches post by specific user only */
import clientPromise from '@/lib/db'
import { UserTypes } from '@/app/profile/page';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
export async function POST(req: Request) {
    try {
        const requestData = await req.json();
        const client = await clientPromise;
        const session = await auth();


        const db = client.db();
        const UserCollection = db.collection("users");
        const PostCollection = db.collection("posts");
        if (!session?.user)
            return Response.json({ "message": "User not authenticated" }, { status: 401 });
        // Step 1: Extract userId, page, and limit from requestData
        const { userId, page = 1, limit = 10 } = requestData; // Default page=1, limit=10
        console.log("userId", requestData.userId, userId);
        // Step 2: Find the user by userId
        const UserData = await UserCollection.findOne({ _id: new ObjectId(userId) }) as UserTypes;
        if (!UserData) {
            // User not found, return response
            return Response.json({ "message": "No user found" }, { status: 404 });
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Step 3: Find posts by the found user with pagination
        const posts = await PostCollection.find({ user_id: new ObjectId(UserData._id) })
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .skip(skip) // Skip the previous pages' items
            .limit(limit) // Limit the number of items
            .toArray();

        const totalPostsCount = await PostCollection.countDocuments({ user_id: new ObjectId(UserData._id) });
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            return {
                user: UserData ? { name: UserData.name, image: UserData.image } : { name: '', image: '' },
                url: post.url,
                title: post.title,
                tags: post.tags,
                likes: post.likes,
                dislikes: post.dislikes,
                userLiked: post.liked_by.some((id: ObjectId) => id.equals(UserData._id)),
                userDisliked: post.disliked_by.some((id: ObjectId) => id.equals(UserData._id)),
                content: post.content,
                postId: post._id,
                isPostInList: UserData?.myList?.some(id => id.equals(post._id)) ?? false
            };
        }));
        const response = {
            name: UserData.name,
            image: UserData.image,
            posts: postsWithUserData,
            total: totalPostsCount
        };

        // Step 5: Return the formatted response
        return Response.json(response, { status: 200 });

    } catch (error) {
        return Response.json(`"message": ${error}`, { status: 404 });
    }
}