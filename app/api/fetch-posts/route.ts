import clientPromise from '@/lib/db'
import fetchUserData from '@/utils/fetchUserData';
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
}
interface Query {
    category?: string;
    tags?: { $in: string[] };
    user_id?: ObjectId;
    liked_by?: ObjectId;
    disliked_by?: ObjectId;
}

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const session = await auth();
        const db = client.db();
        const collection = db.collection("users");
        const UserData = await collection.findOne({ email: session?.user?.email }) as UserTypes;
        const query: Query = {};

        // if (filters.category) query.category = filters.category;
        // if (filters.tags) query.tags = { $in: filters.tags };
        // if (filters.usersPost) query.user_id = new ObjectId(CurrentUserData._id);
        // console.log("reached here")
        // if (filters.likedByUser) query.liked_by = new ObjectId(CurrentUserData._id);
        // console.log("did we reached here?")
        // if (filters.dislikedByUser) query.disliked_by = new ObjectId(CurrentUserData._id);

        // const user = await UserCollection.findOne({ _id: CurrentUserData._id });

        // // If the user document or the myList field does not exist, return null
        // if (!user || !user.myList) {
        //     return null;
        // }

        // const posts = await PostCollection.find(query)
        //     .sort({ created_at: -1 }) // Sort by creation date in descending order
        //     .skip(filters.limit * (filters.page - 1)) // Calculate the number of documents to skip for pagination
        //     .limit(filters.limit)
        //     .toArray();

        return Response.json(JSON.stringify(UserData));
    } catch (err) {
        console.error('Error:', err)
        return Response.json(`Something bad happened ${err}`)
    }
}
