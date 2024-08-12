import clientPromise from '@/lib/db'
import { UserTypes } from '@/app/profile/page';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';

/* Fetches post by specific user only */

export async function POST(req: Request) {
    try {
        console.log("Received request");
        const requestData = await req.json();
        console.log("Request data:", requestData);

        const client = await clientPromise;
        console.log("Database client obtained");

        const session = await auth();
        console.log("Session data:", session);

        const db = client.db();
        const UserCollection = db.collection("users");
        const PostCollection = db.collection("posts");

        if (!session?.user) {
            console.log("User not authenticated");
            return Response.json({ "message": "User not authenticated" }, { status: 401 });
        }

        const { userId, page = 1, limit = 10 } = requestData; // Default page=1, limit=10
        console.log("userId:", userId, "page:", page, "limit:", limit);

        const userObjectId = new ObjectId(userId);
        const UserData = await UserCollection.findOne({ _id: userObjectId }) as UserTypes;
        console.log("User data:", UserData);

        if (!UserData) {
            console.log("No user found");
            return Response.json({ "message": "No user found" }, { status: 404 });
        }

        const skip = (page - 1) * limit;
        console.log("Skip:", skip);

        const posts = await PostCollection.find({ user_id: userObjectId })
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .skip(skip) // Skip the previous pages' items
            .limit(limit) // Limit the number of items
            .toArray();
        console.log("Posts:", posts);

        const totalPostsCount = await PostCollection.countDocuments({ user_id: userObjectId });
        console.log("Total posts count:", totalPostsCount);

        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const postId = new ObjectId(post._id);
            return {
                user: UserData ? { name: UserData.name, image: UserData.image } : { name: '', image: '' },
                url: post.url,
                title: post.title,
                tags: post.tags,
                likes: post.likes,
                dislikes: post.dislikes,
                userLiked: post.liked_by.some((id: any) => new ObjectId(id).equals(userObjectId)),
                userDisliked: post.disliked_by.some((id: any) => new ObjectId(id).equals(userObjectId)),
                content: post.content,
                postId: postId,
                isPostInList: UserData?.myList?.some((id: any) => new ObjectId(id).equals(postId)) ?? false
            };
        }));
        console.log("Posts with user data:", postsWithUserData);

        const response = {
            name: UserData.name,
            image: UserData.image,
            posts: postsWithUserData,
            total: totalPostsCount
        };
        console.log("Response:", response);

        // Step 5: Return the formatted response
        return Response.json(response, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return Response.json({ "message": error }, { status: 500 });
    }
}