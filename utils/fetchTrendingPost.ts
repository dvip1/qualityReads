"use server"
import Trending from "@/lib/Trending";
import { getRedisClient } from "@/lib/redis";
export default async function FetchTrendingPost(filter: "tags" | "daily", num: number) {
    const redisClient = await getRedisClient()
    const TrendingObject = new Trending(redisClient);
    const PostId: string[] = await TrendingObject.getTrendingItemsWithoutScores(filter, num);
    return PostId;
}