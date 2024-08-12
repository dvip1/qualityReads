/* Fetches posts in general, fetches filtered posts */
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { UserTypes } from "@/app/profile/page";
import { PostList, Query } from "./types";
import { buildPipeline } from "./pipeline";

export async function POST(req: Request) {
  try {
    const filters: PostList = await req.json();
    const client = await clientPromise;
    const session = await auth();
    const db = client.db();
    const UserCollection = db.collection("users");
    const PostCollection = db.collection("posts");
    const UserData = (await UserCollection.findOne({
      email: session?.user?.email,
    })) as UserTypes;

    if (!UserData) {
      return Response.json({ message: "No user found" }, { status: 401 });
    }
    const query: Query = {};

    if (filters.category) query.category = filters.category;
    if (filters.tags && Array.isArray(filters.tags)) {
      query.tags = { $in: filters.tags };
    } if (filters.usersPost) query.user_id = new ObjectId(UserData._id);
    if (filters.likedByUser) query.liked_by = new ObjectId(UserData._id);
    if (filters.dislikedByUser) query.disliked_by = new ObjectId(UserData._id);
    if (filters.postIdInArray && Array.isArray(filters.postIdInArray) && filters.postIdInArray.length > 0) {
      query._id = { $in: filters.postIdInArray.map((id) => new ObjectId(id)) };
    }

    const pipeline = await buildPipeline(filters, query, UserData, PostCollection);
    const posts = await PostCollection.aggregate(pipeline).toArray();

    if (filters.postIdInArray && filters.postIdInArray.length > 0) {
      const idOrder = filters.postIdInArray.map((id) => id.toString());
      posts.sort(
        (a, b) =>
          idOrder.indexOf(a.postId.toString()) -
          idOrder.indexOf(b.postId.toString()),
      );
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
      userId: post.userId,
    }));

    return Response.json(
      { posts: postsWithUserData, total: totalPostsCount },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error in POST function:", err);
    return Response.json({ "error": JSON.stringify(err) }, { status: 500 });
  }
}
