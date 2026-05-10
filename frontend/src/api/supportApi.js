import axiosInstance from './axiosInstance';

export const sendSupportMessage = async (messageData) => {
    try {
        const response = await axiosInstance.post('/support/messages/', messageData);
        return response.data;
    } catch (error) {
        console.error("Support API error:", error);
        throw error;
    }
};
