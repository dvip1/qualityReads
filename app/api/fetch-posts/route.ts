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
        };

        let posts;
        if (filters.postIdInArray && filters.postIdInArray.length > 0) {
            // Fetch posts without sorting by created_at
            posts = await PostCollection.find(query).toArray();
            // Reorder posts to match the order in postIdInArray
            const idOrder = filters.postIdInArray.map(id => id.toString());
            posts.sort((a, b) => idOrder.indexOf(a._id.toString()) - idOrder.indexOf(b._id.toString()));
        } else {
            // Apply sorting by created_at if postIdInArray is not provided
            posts = await PostCollection.find(query)
                .sort({ created_at: -1 }) // Sort by creation date in descending order
                .skip(filters.limit * (filters.page - 1)) // Calculate the number of documents to skip for pagination
                .limit(filters.limit)
                .toArray();
        }

        const totalPostsCount = await PostCollection.countDocuments(query);
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const user = await UserCollection.findOne({ _id: post.user_id }, { projection: { name: 1, image: 1 } });
            return {
                user: user ? { name: user.name, image: user.image } : { name: '', image: '' },
                url: post.url,
                title: post.title,
                tags: post.tags,
                likes: post.likes,
                dislikes: post.dislikes,
                userLiked: post.liked_by.some((id: ObjectId) => id.equals(UserData._id)),
                userDisliked: post.disliked_by.some((id: ObjectId) => id.equals(UserData._id)),
                content: post.content,
                postId: post._id,
                isPostInList: UserData?.myList?.some(id => id.equals(post._id)) ?? false,
                userId: post.user_id
            };
        }));
        return Response.json({ posts: postsWithUserData, total: totalPostsCount }, { status: 201 });
    } catch (err) {
        console.error("Error in POST function:", err);
        return Response.json(`Something bad happened ${err}`);
    }
}