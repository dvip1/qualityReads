import RedisNotificationService from "./redisService";
import { getRedisClient } from "@/lib/redis";
import { Server } from 'socket.io';
async function handleCountQuery(service: RedisNotificationService, userId: string) {
    const count = await service.getNotificationCount(userId);
    return Response.json({ data: count }, { status: 200 });
};

async function handleGetAllQuery(service: RedisNotificationService, userId: string) {
    const notifications = await service.getAllNotifications(userId);
    return Response.json({ data: notifications }, { status: 200 });
};

async function handleGetByTypeQuery(service: RedisNotificationService, userId: string, type: string | null) {
    if (!type) {
        return Response.json({ message: "Type parameter is required for getByType query" }, { status: 400 });
    }
    const notifications = await service.readNotifications(userId, type);
    return Response.json({ data: notifications }, { status: 200 });
};

export {
    handleCountQuery,
    handleGetAllQuery,
    handleGetByTypeQuery,
}