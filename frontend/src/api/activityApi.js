import axiosInstance from './axiosInstance';

export const getActivities = async () => {
    const response = await axiosInstance.get('/activities/');
    return response.data;
};

export const createActivity = async (activityData) => {
    const response = await axiosInstance.post('/activities/', activityData);
    return response.data;
};

export const updateActivity = async (id, activityData) => {
    const response = await axiosInstance.put(`/activities/${id}/`, activityData);
    return response.data;
};

export const deleteActivity = async (id) => {
    const response = await axiosInstance.delete(`/activities/${id}/`);
    return response.data;
};
