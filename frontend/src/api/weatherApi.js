import axiosInstance from './axiosInstance';

export const getWeather = async (lat, lng) => {
    const response = await axiosInstance.get(`/weather/current/?lat=${lat}&lng=${lng}`);
    return response.data;
};
