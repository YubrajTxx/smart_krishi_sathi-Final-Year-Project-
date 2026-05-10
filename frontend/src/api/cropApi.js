import axiosInstance from './axiosInstance';

export const getCrops = async () => {
    const response = await axiosInstance.get('/crops/');
    return response.data;
};

export const getCropDetails = async (id) => {
    const response = await axiosInstance.get(`/crops/${id}/`);
    return response.data;
};
