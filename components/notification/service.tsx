import axios from "axios"

async function getNotificationCount(userId: string) {
    const request = await axios.get(`/api/notification?query=count&userId=${userId}`);
    return request.data;
}

export {
    getNotificationCount
}