import RedisNotificationService, { Notification } from "./redisService";
import { getRedisClient } from "@/lib/redis";
import {
    handleCountQuery,
    handleGetAllQuery,
    handleGetByTypeQuery
} from "./utils";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const query = searchParams.get("query");
        const type = searchParams.get("type");
        if (!userId || !query) {
            return Response.json({ message: "Insufficient data" }, { status: 400 });
        }

        const redisClient = await getRedisClient();
        const notificationService = new RedisNotificationService(redisClient);

        switch (query) {
            case "count":
                return await handleCountQuery(notificationService, userId);
            case "getAll":
                return await handleGetAllQuery(notificationService, userId);
            case "getByType":
                return await handleGetByTypeQuery(notificationService, userId, type);
            default:
                return Response.json({ message: "Invalid query" }, { status: 400 });
        }
    } catch (err) {
        console.error("Error in GET request:", err);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * Handles the POST request to insert a notification.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<Response>} - The response object indicating the result of the operation.
 *
 * Required request parameters:
 * @param {string} requestData.userId - The ID of the user.
 * @param {string} requestData.postId - The ID of the post.
 * @param {string} requestData.message - The notification message.
 * @param {string} requestData.metaId - The Id of user who interacted with it.
 * @param {string} requestData.type - The type of notification.
 */
export async function POST(req: Request) {
    try {
        const requestData = await req.json();
        const checkInformation = requestData.userId && requestData.postId && requestData.message && requestData.metaId && requestData.type;

        if (!checkInformation) {
            return Response.json({ "message": "insufficient Information" }, { status: 400 });
        }

        const data: Notification = {
            id: requestData.postId,
            message: requestData.message,
            timestamp: new Date().getTime().toString(),
            metadata: {
                userIds: [requestData.metaId],
                count: 1
            }
        };

        const redisClient = await getRedisClient();
        const NotificationServiceObject = new RedisNotificationService(redisClient);
        await NotificationServiceObject.upsertNotification(requestData.userId, requestData.type, data);

        return Response.json({ "message": "successfully inserted notification" }, { status: 200 });
    } catch (error) {
        console.error("Error inserting notification:", error);
        return Response.json({ "error": error }, { status: 500 });
    }
};


export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const type = searchParams.get("type");
        const postId = searchParams.get("postId");
        const redisClient = await getRedisClient();
        const NotificationServiceObject = new RedisNotificationService(redisClient);

        if (userId && type && postId) {
            NotificationServiceObject.deleteNotification(userId, type, postId);
            return Response.json({ "message": "Deleted Succesfully" }, { status: 200 });
        }
        else if (userId) {
            NotificationServiceObject.clearAllNotifications(userId);
            return Response.json({ "message": "Deleted Succesfully" }, { status: 200 });
        };
        return Response.json({ "message": "Invalid Request                                  " }, { status: 400 });
    }
    catch (error) {
        console.error("Error in GET request:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}