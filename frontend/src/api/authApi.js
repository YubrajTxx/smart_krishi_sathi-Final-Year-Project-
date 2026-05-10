import axiosInstance from './axiosInstance';

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post('/auth/login/', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/auth/register/', userData);
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post('/auth/logout/');
    return response.data;
};

export const getUserProfile = async () => {
    const response = await axiosInstance.get('/auth/profile/');
    return response.data;
};
export const updateUserProfile = async (userData) => {
    const response = await axiosInstance.patch('/auth/profile/', userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
export const changePassword = async (passwordData) => {
    const response = await axiosInstance.put('/auth/change-password/', passwordData);
    return response.data;
};
