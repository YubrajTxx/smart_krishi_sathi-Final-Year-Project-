import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getUserProfile } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const profile = await getUserProfile();
                    // Profile might just be user data, ensure we have what we need
                    setUser({ ...profile, token });
                } catch (error) {
                    console.error("Session check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginUser({ username: email, password }); // Backend expects 'username' but we allow email
            setUser({ ...data.user, token: data.token });
            localStorage.setItem('token', data.token);
            // Also store user data for quick access if needed
            localStorage.setItem('krishi_user', JSON.stringify(data.user));
            return data.user;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await registerUser(userData);
            setUser({ ...data.user, token: data.token });
            localStorage.setItem('token', data.token);
            localStorage.setItem('krishi_user', JSON.stringify(data.user));
            return data.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.warn("Logout API failed", e);
        }
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('krishi_user');
    };

    const refreshProfile = async () => {
        if (localStorage.getItem('token')) {
            try {
                const profile = await getUserProfile();
                const token = localStorage.getItem('token');
                const newUser = { ...profile, token };
                setUser(newUser);
                localStorage.setItem('krishi_user', JSON.stringify(newUser));
            } catch (error) {
                console.error("Profile refresh failed", error);
            }
        }
    };

    useEffect(() => {
        let interval;
        if (user) {
            interval = setInterval(refreshProfile, 30000); // Sync every 30 seconds
        }
        return () => clearInterval(interval);
    }, [user]);

    const updateUserData = (userData) => {
        if (userData) {
            const token = localStorage.getItem('token');
            const newUser = { ...user, ...userData, token };
            setUser(newUser);
            localStorage.setItem('krishi_user', JSON.stringify(newUser));
        } else {
            setUser(null);
            localStorage.removeItem('krishi_user');
        }
    };

    const toggleRole = () => {
        if (user) {
            const newRole = user.role === 'admin' ? 'farmer' : 'admin';
            const newUser = { ...user, role: newRole };
            setUser(newUser);
            localStorage.setItem('krishi_user', JSON.stringify(newUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshProfile, toggleRole, loading, setUser: updateUserData }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
