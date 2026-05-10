import axiosInstance from './axiosInstance';

export const getNotifications = async () => {
    const response = await axiosInstance.get('/notifications/');
    return response.data;
};

export const createNotification = async (notificationData) => {
    const response = await axiosInstance.post('/notifications/', notificationData);
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await axiosInstance.patch(`/notifications/${id}/`, { read: true });
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await axiosInstance.post('/notifications/mark-all-read/');
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}/`);
    return response.data;
};

export const clearAllNotifications = async () => {
    const response = await axiosInstance.delete('/notifications/clear-all/');
    return response.data;
};
