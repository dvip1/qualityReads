import axios from "axios"
import { Notification, NotificationCardProps } from "./notificationCard";
async function getNotificationCount(userId: string) {
    const request = await axios.get(`/api/notification?query=count&userId=${userId}`);
    return request.data;
}
async function getAllNotification(userId: string) {
    const request = await axios.get(`/api/notification?userId=${userId}&query=getAll`);
    return request.data;
};
async function getByTypeNotification(userId: string, query: string, type: string) {
    const request = await axios.get(`/api/notification?userId=${userId}&query=getByType`);
    return request.data;
};

async function ClearAllNotification(userId: string) {
    try {
        axios.delete(`/api/notification?userId=${userId}`);
        return 1;
    } catch (error) {
        console.error(`Got an error: ${error}`);
        return 0;
    }
}
async function ClearByPostId(userId: string, postId: string, type: string) {
    try {
        axios.delete(`/api/notification?userId=${userId}&type=${type}&postId=${postId}`);
        return 1;
    } catch (error) {
        console.error(`Got an error: ${error}`);
        return 0;
    }
}

interface PostNotificationTypes {
    userId: string;
    postId: string;
    message: string;
    metaId: string;
    type: string;
}
async function PostNotificationData(props: PostNotificationTypes) {
    try {
        const baseUrl = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}`;
        const apiUrl = `${baseUrl}/api/notification`;
        const response = await axios.post(apiUrl, props, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`Response received: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`Error occurred: ${error}`);
        throw new Error(`An error occurred while posting notification data: ${error}`);
    }
};

export {
    getNotificationCount,
    getAllNotification,
    getByTypeNotification,
    ClearAllNotification,
    PostNotificationData,
    ClearByPostId
}                                                       