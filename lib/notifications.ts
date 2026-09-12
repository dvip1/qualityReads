import "server-only"
import { getRedisClient } from "./redis"
import RedisNotificationService, { type Notification } from "@/app/api/notification/redisService"

export type NotificationEvent = {
    type: string
    postId?: string
    at: number
}

export function notificationChannel(userId: string): string {
    return `notifications:${userId}`
}

/**
 * Fire-and-forget realtime ping telling a user's open tabs to refresh.
 *
 * The durable copy of the notification is written by saveNotification(); this is
 * only the nudge, so a missed publish (e.g. during a restart) costs nothing —
 * the client resyncs its count whenever the stream reconnects.
 */
export async function publishNotification(
    userId: string,
    event: Omit<NotificationEvent, "at">
): Promise<void> {
    if (!userId) return
    try {
        const redis = getRedisClient()
        const payload: NotificationEvent = { ...event, at: Date.now() }
        await redis.publish(notificationChannel(userId), JSON.stringify(payload))
    } catch (error) {
        // A notification is never worth failing the user's action over.
        console.error("[notifications] publish failed:", error)
    }
}

export type SaveNotificationInput = {
    userId: string
    postId: string
    message: string
    metaId: string
    type: string
}

/**
 * Persists a notification in Redis.
 *
 * This used to be an HTTP POST from a server action to the app's own
 * /api/notification route, which required SERVER_HOST/SERVER_PROTOCOL to be set
 * to something the container could reach itself on. It is an in-process call now.
 */
export async function saveNotification(input: SaveNotificationInput): Promise<void> {
    const { userId, postId, message, metaId, type } = input
    if (!userId || !postId || !message || !metaId || !type) {
        console.warn("[notifications] skipping save: insufficient information")
        return
    }

    const data: Notification = {
        id: postId,
        message,
        timestamp: new Date().getTime().toString(),
        metadata: { userIds: [metaId], count: 1 },
    }

    const service = new RedisNotificationService(getRedisClient())
    await service.upsertNotification(userId, type, data)
}
