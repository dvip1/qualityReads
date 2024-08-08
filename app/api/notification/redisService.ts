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

  private async getNotifications(key: string): Promise<Notification[]> {
    const existingNotificationsStr = await this.redis.get(key);
    return existingNotificationsStr ? JSON.parse(existingNotificationsStr) : [];
  }

  async upsertNotification(userId: string, type: string, notificationData: Notification): Promise<void> {
    const key = this.getKey(userId, type);
    const notifications: Notification[] = await this.getNotifications(key);

    const existingNotificationIndex = notifications.findIndex(n => n.id === notificationData.id);

    let shouldIncrementCount = false;

    if (existingNotificationIndex !== -1) {
      shouldIncrementCount = await this.updateExistingNotification(notifications, existingNotificationIndex, userId, notificationData);
    } else {
      await this.addNewNotification(notifications, notificationData);
      shouldIncrementCount = true;
    }

    await this.saveNotifications(key, notifications);

    if (shouldIncrementCount) {
      await this.incrementNotificationCount(userId);
    }
  }

  private async updateExistingNotification(
    notifications: Notification[],
    index: number,
    userId: string,
    notificationData: Notification
  ): Promise<boolean> {
    const existingNotification = notifications[index];
    const updatedUserIds = new Set(existingNotification.metadata.userIds);
    const newUserId = notificationData.metadata.userIds[0]; // The user who triggered the notification

    let userAdded = false;

    if (updatedUserIds.has(newUserId)) {
      updatedUserIds.delete(newUserId);
      this.decrementNotificationCount(userId);
    } else {
      updatedUserIds.add(newUserId);
      userAdded = true;
    }

    notifications[index] = {
      ...existingNotification,
      ...notificationData,
      metadata: {
        ...existingNotification.metadata,
        ...notificationData.metadata,
        userIds: Array.from(updatedUserIds),
        count: updatedUserIds.size
      }
    };

    return userAdded;
  }
  private async addNewNotification(notifications: Notification[], notificationData: Notification): Promise<void> {
    notifications.push({
      ...notificationData,
      metadata: {
        ...notificationData.metadata,
        count: notificationData.metadata.userIds.length
      }
    });
  }
  private async saveNotifications(key: string, notifications: Notification[]): Promise<void> {
    await this.redis.set(key, JSON.stringify(notifications));
  }

  async readNotifications(userId: string, type: string): Promise<Notification[]> {
    const key = this.getKey(userId, type);
    const notificationsStr = await this.redis.get(key);
    return notificationsStr ? JSON.parse(notificationsStr) : [];
  };

  async deleteNotification(userId: string, type: string, notificationId: string): Promise<void> {
    const key = this.getKey(userId, type);
    console.log(`Input Data:  ${notificationId}`);
    const notificationCount = await this.getNotificationCount(userId);
    const notificationsStr = await this.redis.get(key);
    if (notificationsStr) {
      console.log(`notificationsStr: ${notificationsStr}`);
      let notifications: Notification[] = JSON.parse(notificationsStr);
      console.log(`notifications: ${JSON.stringify(notifications)}`);
      const initialLength = notifications.length;
      notifications = notifications.filter(n => {
        const match = n.id.trim() !== notificationId.trim();
      });
      console.log('filter notifications', JSON.stringify(notifications));

      if (notifications.length < initialLength) {
        const updateLength = notifications.length > 0 ? notificationCount - notifications[0].metadata.count : 0;
        await this.redis.set(key, JSON.stringify(notifications));
        await this.redis.set(`${userId}:notification_count`, updateLength.toString());
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

    for (const key of keys) {
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