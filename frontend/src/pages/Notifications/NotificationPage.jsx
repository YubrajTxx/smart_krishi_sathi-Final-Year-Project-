import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faCheckCircle,
    faExclamationTriangle,
    faInfoCircle,
    faSeedling,
    faCloudRain,
    faTrash,
    faCheckDouble,
    faFilter
} from '@fortawesome/free-solid-svg-icons';
import {
    getNotifications,
    markAsRead as apiMarkAsRead,
    markAllAsRead as apiMarkAllRead,
    deleteNotification as apiDeleteNotification,
    clearAllNotifications
} from '../../api/notificationApi';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const NotificationPage = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeDetails = (type) => {
        switch (type) {
            case 'weather': return { icon: faCloudRain, color: '#3B82F6' };
            case 'activity': return { icon: faSeedling, color: '#10B981' };
            case 'system': return { icon: faInfoCircle, color: '#6366F1' };
            case 'warning': return { icon: faExclamationTriangle, color: '#F59E0B' };
            default: return { icon: faBell, color: '#64748b' };
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return t('just_now');
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return t('minutes_ago', { count: diffInMinutes });
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return t('hours_ago', { count: diffInHours });
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return t('days_ago', { count: diffInDays });

        return date.toLocaleDateString();
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter);

    const handleMarkAsRead = async (id) => {
        try {
            await apiMarkAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiDeleteNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await apiMarkAllRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm(t('confirm_clear_notifications'))) return;
        try {
            await clearAllNotifications();
            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear notifications", error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="notif-header"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2.5rem',
                    gap: '1.5rem'
                }}
            >
                <div>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '800', color: '#1e293b', margin: 0 }}>{t('notifications')}</h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem', fontWeight: '500' }}>{t('notifications_desc')}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleMarkAllRead}
                        className="btn btn-blue-outline"
                        style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap' }}
                    >
                        <FontAwesomeIcon icon={faCheckDouble} style={{ marginRight: '6px' }} /> {t('mark_all_read')}
                    </button>
                    <button
                        onClick={handleClearAll}
                        style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: '6px' }} /> {t('clear_all')}
                    </button>
                </div>
            </motion.div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{ fontSize: '2.5rem', color: 'var(--primary)' }}
                    >
                        <FontAwesomeIcon icon={faBell} />
                    </motion.div>
                </div>
            ) : notifications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                >
                    <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#94a3b8', fontSize: '2rem' }}>
                        <FontAwesomeIcon icon={faBell} />
                    </div>
                    <h3 style={{ color: '#1e293b', margin: '0 0 0.5rem' }}>{t('all_caught_up')}</h3>
                    <p style={{ color: '#64748b' }}>{t('no_new_notifications')}</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }} className="filter-bar">
                        {['all', 'weather', 'activity', 'system', 'warning'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    border: 'none',
                                    background: filter === type ? '#3B82F6' : '#f1f5f9',
                                    color: filter === type ? 'white' : '#64748b',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {type === 'all' ? t('all_alerts') : t(type)}
                            </button>
                        ))}
                    </div>
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.length === 0 ? (
                            <motion.div
                                key="empty-filter"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}
                            >
                                <p style={{ color: '#94a3b8', margin: 0 }}>{t('no_filter_notifications', { filter: t(filter) })}</p>
                            </motion.div>
                        ) : (
                            filteredNotifications.map((notif) => {
                                const details = getTypeDetails(notif.type);
                                return (
                                    <motion.div
                                        key={notif.id}
                                        variants={itemVariants}
                                        exit={{ opacity: 0, x: 20 }}
                                        layout
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        style={{
                                            background: notif.read ? 'rgba(255, 255, 255, 0.6)' : 'white',
                                            padding: '1.5rem',
                                            borderRadius: '20px',
                                            border: notif.read ? '1px solid #f1f5f9' : '1px solid #e2e8f0',
                                            boxShadow: notif.read ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            gap: '1.25rem',
                                            alignItems: 'flex-start',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'all 0.2s ease'
                                        }}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        {!notif.read && (
                                            <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '10px', height: '10px', background: '#3B82F6', borderRadius: '50%' }}></span>
                                        )}
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: `${details.color}15`,
                                            color: details.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifySelf: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            flexShrink: 0
                                        }}>
                                            <FontAwesomeIcon icon={details.icon} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                <h4 style={{ margin: 0, color: notif.read ? '#64748b' : '#1e293b', fontSize: '1.1rem', fontWeight: '700' }}>{notif.title}</h4>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>{formatTime(notif.created_at)}</span>
                                            </div>
                                            <p style={{ margin: 0, color: notif.read ? '#94a3b8' : '#475569', lineHeight: '1.5', fontSize: '0.95rem' }}>{notif.message}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(notif.id);
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            <style jsx>{`
                .btn-blue-outline {
                    border: 1.5px solid #3B82F6;
                    color: #3B82F6;
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-blue-outline:hover {
                    background: #3B82F6;
                    color: white;
                }
                @media (max-width: 640px) {
                    .notif-header {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 1rem !important;
                        margin-bottom: 1.5rem !important;
                    }
                    .notif-header > div:last-child {
                        width: 100%;
                        justify-content: flex-start !important;
                        gap: 0.5rem !important;
                    }
                    .btn-blue-outline, 
                    .notif-header button {
                        padding: 0.4rem 0.8rem !important;
                        font-size: 0.8rem !important;
                        flex: 1;
                        text-align: center;
                    }
                }
                @media (max-width: 480px) {
                    .notif-header h1 {
                        font-size: 1.8rem !important;
                    }
                    .notif-header p {
                        font-size: 0.85rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default NotificationPage;
