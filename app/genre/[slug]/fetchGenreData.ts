"use server"
import clientPromise from "@/lib/db";
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

        // Calculate the number of documents to skip for pagination
        const skips = props.limit * (props.page - 1);

        // Find posts by category with pagination
        const posts = await Postcollection.find({ category: props.category })
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .skip(skips)
            .limit(props.limit)
            .toArray();

        // For each post, find the user data
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const user = await Userscollection.findOne({ _id: post.user_id }, { projection: { name: 1, image: 1 } });
            return {
                user: user ? { name: user.name, image: user.image } : { name: '', image: '' },
                url: post.url,
                title: post.title,
                tags: post.tags,
                likes: post.likes,
                dislikes: post.dislikes,
                content: post.content
            };
        }));

        return postsWithUserData;
    }
    catch (e) {
        console.error(`Error occurred ${e}`);
        throw new Error(`Error occurred during creating Post ${e}`)
    }
}
export default fetchGenreData;