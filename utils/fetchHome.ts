"use server"
import clientPromise from "@/lib/db";
import fetchUserData from "@/utils/fetchUserData";
import { ObjectId } from "mongodb";
interface fetchHomeTypes {
    page: number
    limit: number
}

const fetchHomeData = async (props: fetchHomeTypes) => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const Postcollection = db.collection('posts');
        const Userscollection = db.collection('users');
        const CurrentUserData = await fetchUserData();
        // Calculate the number of documents to skip for pagination
        const skips = props.limit * (props.page - 1);

        // Find all posts with pagination
        const posts = await Postcollection.find()
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .skip(skips)
            .limit(props.limit)
            .toArray();

        // Get total number of posts
        const totalPosts = await Postcollection.countDocuments();
        // For each post, find the user data
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const user = await Userscollection.findOne({ _id: post.user_id }, { projection: { name: 1, image: 1 } });
            const userLiked = !!(await Postcollection.countDocuments({ _id: post._id, liked_by: { $in: [CurrentUserData._id] } }));
            const userDisliked = !!(await Postcollection.countDocuments({ _id: post._id, disliked_by: { $in: [CurrentUserData._id] } }));
            const isPostInList: boolean = !!(await Userscollection.findOne({ _id: CurrentUserData._id, myList: { $in: [new ObjectId(post._id)] } }));
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
                isPostInList
            };
        }));

        return JSON.parse(
            JSON.stringify(
                {
                    posts: postsWithUserData,
                    total: totalPosts
                }
            ));
    }
    catch (e) {
        console.error(`Error occurred ${e}`);
        throw new Error(`Error occurred during creating Post ${e}`)
    }
}
export default fetchHomeData;