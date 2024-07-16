/* Fetches posts in general, fetches filtered posts */
import clientPromise from '@/lib/db'
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import { UserTypes } from '@/app/profile/page';

interface PostList {
    page: number
    limit: number
    category?: string
    tags?: string[]
    usersPost?: boolean
    likedByUser?: boolean
    dislikedByUser?: boolean
    sortBy?: 'liked' | 'recent' | 'disliked';
    postIdInArray: string[]
}
interface Query {
    category?: string;
    tags?: { $in: string[] };
    user_id?: ObjectId;
    liked_by?: ObjectId;
    disliked_by?: ObjectId;
    _id?: ObjectId | { $in: ObjectId[] }; // Allow _id to be either an ObjectId or have the $in operator with an array of ObjectId

}
export async function POST(req: Request) {
    try {
        const filters: PostList = await req.json();
        const client = await clientPromise;
        const session = await auth();
        const db = client.db();
        const UserCollection = db.collection("users");
        const PostCollection = db.collection("posts");
        const UserData = await UserCollection.findOne({ email: session?.user?.email }) as UserTypes;

        if (!UserData) {
            return Response.json({ "message": "No user found" }, { status: 401 });
        }

        const query: Query = {};

        if (filters.category) query.category = filters.category;
        if (filters.tags) query.tags = { $in: filters.tags };
        if (filters.usersPost) query.user_id = new ObjectId(UserData._id);
        if (filters.likedByUser) query.liked_by = new ObjectId(UserData._id);
        if (filters.dislikedByUser) query.disliked_by = new ObjectId(UserData._id);
        if (filters.postIdInArray && filters.postIdInArray.length > 0) {
            query._id = { $in: filters.postIdInArray.map(id => new ObjectId(id)) };
        }

        const pipeline: any[] = [
            { $match: query },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_info"
                }
            },
            { $unwind: "$user_info" },
            {
                $project: {
                    url: 1,
                    title: 1,
                    tags: 1,
                    likes: 1,
                    dislikes: 1,
                    content: 1,
                    postId: "$_id",
                    user: { name: "$user_info.name", image: "$user_info.image" },
                    userLiked: { $in: [UserData._id, "$liked_by"] },
                    userDisliked: { $in: [UserData._id, "$disliked_by"] },
                    isPostInList: { $in: ["$_id", UserData.myList] },
                    userId: "$user_id"
                }
            }
        ];

        if (filters.postIdInArray && filters.postIdInArray.length > 0) {
            // No sorting for specific post IDs, reorder later
            pipeline.push({ $sort: { _id: 1 } }); // Temporary sort to maintain order for subsequent processing
        } else {
            // Apply sorting by created_at if postIdInArray is not provided
            pipeline.push({ $sort: { created_at: -1 } });
            pipeline.push({ $skip: filters.limit * (filters.page - 1) });
            pipeline.push({ $limit: filters.limit });
        }

        const posts = await PostCollection.aggregate(pipeline).toArray();

        if (filters.postIdInArray && filters.postIdInArray.length > 0) {
            const idOrder = filters.postIdInArray.map(id => id.toString());
            posts.sort((a, b) => idOrder.indexOf(a.postId.toString()) - idOrder.indexOf(b.postId.toString()));
        }

        const totalPostsCount = await PostCollection.countDocuments(query);

        const postsWithUserData = posts.map((post) => ({
            user: post.user,
            url: post.url,
            title: post.title,
            tags: post.tags,
            likes: post.likes,
            dislikes: post.dislikes,
            userLiked: post.userLiked,
            userDisliked: post.userDisliked,
            content: post.content,
            postId: post.postId,
            isPostInList: post.isPostInList,
            userId: post.userId
        }));
        return Response.json({ posts: postsWithUserData, total: totalPostsCount }, { status: 201 });
    } catch (err) {
        console.error("Error in POST function:", err);
        return Response.json(`Something bad happened ${err}`);
    }
}