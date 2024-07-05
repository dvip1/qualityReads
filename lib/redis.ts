"use server"

import Redis from "ioredis"

type RedisOptions = {
    host: string | undefined;
    port: number;
    password?: string;
};

const redisOptions: RedisOptions = {
    host: process.env.REDIS_URI,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
};
if (process.env.REDIS_PASSWORD) {
    redisOptions['password'] = process.env.REDIS_PASSWORD;
}

const redisClient = new Redis(redisOptions);

export async function getRedisClient() {
    return redisClient;
}