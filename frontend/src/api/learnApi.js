import axiosInstance from './axiosInstance';

export const getResources = async () => {
    const response = await axiosInstance.get('/learn/');
    return response.data;
};
