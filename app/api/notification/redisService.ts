import Redis from 'ioredis';

export interface NotificationMetadata {
  userIds: string[];
  additionalInfo?: string;
  count: number;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  metadata: NotificationMetadata;
}

class RedisNotificationService {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  private getKey(userId: string, type: string): string {
    return `${userId}:notifications:${type}`;
  }

  async upsertNotification(userId: string, type: string, notificationData: Notification): Promise<void> {
    const key = this.getKey(userId, type);
    const existingNotificationsStr = await this.redis.get(key);
    let notifications: Notification[] = existingNotificationsStr ? JSON.parse(existingNotificationsStr) : [];

    const existingNotificationIndex = notifications.findIndex(n => n.id === notificationData.id);

    if (existingNotificationIndex !== -1) {
      // Update existing notification
      const existingNotification = notifications[existingNotificationIndex];
      const updatedNotification = {
        ...existingNotification,
        ...notificationData,
        metadata: {
          ...existingNotification.metadata,
          ...notificationData.metadata,
          userIds: Array.from(new Set([
            ...existingNotification.metadata.userIds,
            ...notificationData.metadata.userIds
          ])).filter(id => notificationData.metadata.userIds.includes(id))
        }
      };
      updatedNotification.metadata.count = updatedNotification.metadata.userIds.length;
      notifications[existingNotificationIndex] = updatedNotification;
    } else {
      // Add new notification
      notifications.push({
        ...notificationData,
        metadata: {
          ...notificationData.metadata,
          count: notificationData.metadata.userIds.length
        }
      });
      await this.incrementNotificationCount(userId);
    }

    await this.redis.set(key, JSON.stringify(notifications));
  }

  async readNotifications(userId: string, type: string): Promise<Notification[]> {
    const key = this.getKey(userId, type);
    const notificationsStr = await this.redis.get(key);
    return notificationsStr ? JSON.parse(notificationsStr) : [];
  }

  async deleteNotification(userId: string, type: string, notificationId: string): Promise<void> {
    const key = this.getKey(userId, type);
    const notificationsStr = await this.redis.get(key);
    if (notificationsStr) {
      let notifications: Notification[] = JSON.parse(notificationsStr);
      const initialLength = notifications.length;
      notifications = notifications.filter(n => n.id !== notificationId);
      if (notifications.length < initialLength) {
        await this.redis.set(key, JSON.stringify(notifications));
        await this.decrementNotificationCount(userId);
      }
    }
  }

  async getNotificationCount(userId: string): Promise<number> {
    const countKey = `${userId}:notification_count`;
    const count = await this.redis.get(countKey);
    return count ? parseInt(count, 10) : 0;
  }

  private async incrementNotificationCount(userId: string): Promise<void> {
    const countKey = `${userId}:notification_count`;
    await this.redis.incr(countKey);
  }

  private async decrementNotificationCount(userId: string): Promise<void> {
    const countKey = `${userId}:notification_count`;
    await this.redis.decr(countKey);
  }

  async getAllNotifications(userId: string): Promise<Notification[]> {
    const pattern = `${userId}:notifications:*`;
    const keys = await this.redis.keys(pattern);
    const notifications: Notification[] = [];

    for (const key of                   keys) {
      const notificationStr = await this.redis.get(key);
      if (notificationStr) {
        notifications.push(JSON.parse(notificationStr));
      }
    }

    return notifications;
  }

  async clearAllNotifications(userId: string): Promise<void> {
    const pattern = `${userId}:notifications:*`;
    const keys = await this.redis.keys(pattern);
      
    if (keys.length > 0) {
      await this.redis.del(...keys);
      await this.redis.set(`${userId}:notification_count`, '0');
    }
  }
}

export default RedisNotificationService;