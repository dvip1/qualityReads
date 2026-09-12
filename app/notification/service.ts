// Client-side notification API calls. Every URL here is relative, so this module
// carries no environment dependencies and is safe in the browser bundle.
//
// The server-side counterparts (persisting and publishing notifications) live in
// lib/notifications.ts and are called in-process — they used to be HTTP requests
// from the server back to itself.
import axios from "axios"

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
};
async function ClearByPostId(userId: string, postId: string, type: string) {
    try {
        axios.delete(`/api/notification?userId=${userId}&type=${type}&postId=${postId}`);
        return 1;
    } catch (error) {
        console.error(`Got an error: ${error}`);
        return 0;
    }
}

export {
    getNotificationCount,
    getAllNotification,
    getByTypeNotification,
    ClearAllNotification,
    ClearByPostId,
}
