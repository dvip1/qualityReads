"use server"
import clientPromise from "@/lib/db";
import fetchUserData from "@/utils/fetchUserData";
interface fetchGenreTypes {
    category: string
    page: number
    limit: number
}

const fetchGenreData = async (props: fetchGenreTypes) => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const Postcollection = db.collection('posts');
        const Userscollection = db.collection('users');
        const CurrentUserData = await fetchUserData();
        // Calculate the number of documents to skip for pagination
        const skips = props.limit * (props.page - 1);

        // Find posts by category with pagination
        const posts = await Postcollection.find({ category: props.category })
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .skip(skips)
            .limit(props.limit)
            .toArray();

        // Get total number of posts
        const totalPosts = await Postcollection.countDocuments({ category: props.category });
        console.log(`Current User: ${CurrentUserData._id}`);
        // For each post, find the user data
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const user = await Userscollection.findOne({ _id: post.user_id }, { projection: { name: 1, image: 1 } });
            const userLiked = !!(await Postcollection.countDocuments({ _id: post._id, liked_by: { $in: [CurrentUserData._id] } }));
            const userDisliked = !!(await Postcollection.countDocuments({ _id: post._id, disliked_by: { $in: [CurrentUserData._id] } }));
            const isPostInList = !!(await Userscollection.findOne({ _id: CurrentUserData._id, myList: { $in: [post._id] } }));

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
        console.log(`Sending User data: ${JSON.stringify(postsWithUserData)}`)
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
export default fetchGenreData;