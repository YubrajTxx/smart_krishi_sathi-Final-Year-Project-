import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { getActivities, updateActivity } from '../api/activityApi';
import { createNotification, getNotifications } from '../api/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Ref to avoid closure issues in setInterval
    const activitiesRef = useRef([]);

    const fetchAllData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [notifs, acts] = await Promise.all([
                getNotifications(),
                getActivities()
            ]);
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
            setActivities(acts);
            activitiesRef.current = acts;
        } catch (error) {
            console.error("Failed to fetch notification data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAllData();
        } else {
            setNotifications([]);
            setActivities([]);
            activitiesRef.current = [];
            setUnreadCount(0);
        }
    }, [user]);

    // Global Scheduler for Reminders
    useEffect(() => {
        if (!user) return;

        const checkReminders = async () => {
            const now = new Date();
            const currentActivities = activitiesRef.current;
            
            for (const activity of currentActivities) {
                if (activity.reminder_time && !activity.notified && activity.status !== 'Completed') {
                    const reminderDate = new Date(activity.reminder_time);
                    const diff = now.getTime() - reminderDate.getTime();
                    
                    // Trigger if time has passed (catch-up logic)
                    if (diff >= 0) {
                        try {
                            // 1. Browser Push Notification
                            if ("Notification" in window && Notification.permission === "granted") {
                                new Notification(`Reminder: ${activity.type}`, {
                                    body: `It's time for ${activity.crop} ${activity.type.toLowerCase()}!`,
                                    icon: '/favicon.ico'
                                });
                            }
                            
                            // 2. Create in-app notification
                            await createNotification({
                                type: 'activity',
                                title: `Activity Reminder: ${activity.type}`,
                                message: `It's time for ${activity.crop} ${activity.type.toLowerCase()}!`,
                                read: false
                            });
                            
                            // 3. Mark Activity as Notified in backend
                            await updateActivity(activity.id, { ...activity, notified: true });
                            
                            // 4. Update local state
                            const updatedActivities = activitiesRef.current.map(a => 
                                a.id === activity.id ? { ...a, notified: true } : a
                            );
                            setActivities(updatedActivities);
                            activitiesRef.current = updatedActivities;
                            
                            // 5. Refresh notifications list to show the new one
                            const newNotifs = await getNotifications();
                            setNotifications(newNotifs);
                            setUnreadCount(newNotifs.filter(n => !n.read).length);

                        } catch (err) {
                            console.error("Failed to process reminder:", err);
                        }
                    }
                }
            }
        };

        const interval = setInterval(checkReminders, 15000); // Check every 15 seconds
        return () => clearInterval(interval);
    }, [user]);

    const refreshNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
    };

    const refreshReminders = async () => {
        const data = await getActivities();
        setActivities(data);
        activitiesRef.current = data;
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            activities, 
            loading, 
            refreshNotifications, 
            refreshReminders 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
