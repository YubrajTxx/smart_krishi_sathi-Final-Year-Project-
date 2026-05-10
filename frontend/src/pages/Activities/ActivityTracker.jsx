import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarCheck,
    faSeedling,
    faTint,
    faVial,
    faHistory,
    faPlus,
    faCheckCircle,
    faExclamationCircle,
    faClock,
    faTimes,
    faTrash,
    faEdit,
    faBell
} from '@fortawesome/free-solid-svg-icons';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../../api/activityApi';
import { createNotification } from '../../api/notificationApi';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const ActivityTracker = () => {
    const { t } = useTranslation();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [formData, setFormData] = useState({
        type: 'Planting',
        crop: '',
        date: '',
        status: 'Pending',
        reminder_time: '',
        notes: ''
    });
    const { refreshReminders, activities: contextActivities } = useNotifications();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivities();
        
        // Request notification permission
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }, []);

    // Global Notification logic has been moved to NotificationContext.jsx for app-wide support.

    const fetchActivities = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const data = await getActivities();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (activity = null) => {
        if (!user) {
            alert('Please log in to manage your farming log and activities.');
            navigate('/login');
            return;
        }
        if (activity) {
            setEditingActivity(activity);
            setFormData({
                type: activity.type,
                crop: activity.crop,
                date: activity.date,
                status: activity.status,
                reminder_time: activity.reminder_time || '',
                notes: activity.notes || ''
            });
        } else {
            setEditingActivity(null);
            setFormData({
                type: 'Planting',
                crop: '',
                date: new Date().toISOString().split('T')[0],
                status: 'Planned',
                reminder_time: '',
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingActivity) {
                await updateActivity(editingActivity.id, formData);
            } else {
                await createActivity(formData);
            }
            await fetchActivities();
            refreshReminders(); // Notify global context
            setIsModalOpen(false);
            setEditingActivity(null);
        } catch (error) {
            console.error("Failed to save activity:", error);
            alert("Failed to save activity. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (!user) {
            alert('Please log in to delete activities.');
            navigate('/login');
            return;
        }
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                await deleteActivity(id);
                setActivities(activities.filter(act => act.id !== id));
            } catch (error) {
                console.error("Failed to delete activity:", error);
                alert("Failed to delete activity.");
            }
        }
    };

    const handleToggleStatus = async (activity) => {
        if (!user) {
            alert('Please log in to update activity statuses.');
            navigate('/login');
            return;
        }
        const newStatus = activity.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            await updateActivity(activity.id, { ...activity, status: newStatus });
            setActivities(activities.map(act =>
                act.id === activity.id ? { ...act, status: newStatus } : act
            ));
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const stats = {
        completed: activities.filter(a => a.status === 'Completed').length,
        pending: activities.filter(a => a.status === 'Pending').length,
        upcoming: activities.filter(a => a.status === 'Planned').length
    };

    return (
        <div className="page-container activities-page">
            <header className="header-card">
                <div>
                    <h2 className="activities-title">{t('farming_log')}</h2>
                    <p className="activities-subtitle">{t('farming_log_desc')}</p>
                </div>
                <button className="btn btn-green add-activity-btn" onClick={() => openModal()}>
                    <FontAwesomeIcon icon={faPlus} /> {t('log_new_activity')}
                </button>
            </header>

            <div className="insights-row">
                <div className="card insight-stat-card">
                    <div className="stat-icon completed"><FontAwesomeIcon icon={faCheckCircle} /></div>
                    <div className="stat-info">
                        <h3>{stats.completed}</h3>
                        <p>{t('completed_tasks')}</p>
                    </div>
                </div>
                <div className="card insight-stat-card">
                    <div className="stat-icon pending"><FontAwesomeIcon icon={faExclamationCircle} /></div>
                    <div className="stat-info">
                        <h3>{stats.pending}</h3>
                        <p>{t('pending_actions')}</p>
                    </div>
                </div>
                <div className="card insight-stat-card">
                    <div className="stat-icon upcoming"><FontAwesomeIcon icon={faClock} /></div>
                    <div className="stat-info">
                        <h3>{stats.upcoming}</h3>
                        <p>{t('upcoming_events')}</p>
                    </div>
                </div>
            </div>

            <h3 className="section-title">{t('recent_activities')}</h3>
            <div className="activities-grid">
                <AnimatePresence>
                    {activities.map((act) => (
                        <motion.div
                            key={act.id}
                            className="card activity-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <div className="activity-header">
                                <div className={`activity-icon-wrapper ${act.type.toLowerCase()}`}>
                                    <FontAwesomeIcon icon={act.type === 'Planting' ? faSeedling : act.type === 'Irrigation' ? faTint : faVial} />
                                </div>
                                <span className={`status-badge ${act.status.toLowerCase()}`}>
                                    {act.status}
                                </span>
                            </div>

                            <h3 className="activity-type">{act.type}</h3>
                            <p className="activity-crop">Crop: <strong>{act.crop}</strong></p>

                            <div className="activity-date">
                                <FontAwesomeIcon icon={faCalendarCheck} />
                                <span>{act.date}</span>
                            </div>

                            {act.notes && (
                                <div className="activity-notes-preview">
                                    <p>"{act.notes.length > 60 ? act.notes.substring(0, 60) + '...' : act.notes}"</p>
                                </div>
                            )}

                            <div className="activity-footer">
                                <button className="btn btn-blue-outline activity-btn" onClick={() => openModal(act)}>
                                    <FontAwesomeIcon icon={faEdit} /> {t('edit')}
                                </button>
                                <button className="btn btn-red-outline activity-btn" onClick={() => handleDelete(act.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                {act.status !== 'Completed' && (
                                    <button
                                        className="btn btn-green activity-btn-done"
                                        onClick={() => handleToggleStatus(act)}
                                    >
                                        {t('done')}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {loading && <p>{t('loading_activities')}</p>}
                    {!loading && activities.length === 0 && <p>{t('no_activities_found')}</p>}
                </AnimatePresence>
            </div>

            {/* Simple Modal Overlay */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-content card"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="modal-header">
                            <h3>{editingActivity ? t('edit_activity') : t('new_activity')}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>{t('activity_type')}</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="Planting">Planting</option>
                                    <option value="Irrigation">Irrigation</option>
                                    <option value="Fertilizing">Fertilizing</option>
                                    <option value="Weeding">Weeding</option>
                                    <option value="Harvesting">Harvesting</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{t('activity_name')}</label>
                                <input
                                    type="text"
                                    value={formData.crop}
                                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                                    placeholder="e.g. Rice, Wheat"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('activity_date')}</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('activity_status')}</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Planned">Planned</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faBell} /> Set Reminder (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.reminder_time ? formData.reminder_time.slice(0, 16) : ''}
                                    onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                                />
                                <p className="help-text">{t('reminder_help_text')}</p>
                            </div>
                            <div className="form-group">
                                <label>{t('activity_notes')}</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder={t('activity_notes_placeholder')}
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-blue-outline" onClick={() => setIsModalOpen(false)}>{t('cancel')}</button>
                                <button type="submit" className="btn btn-green">{t('save_activity')}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <style jsx>{`
                .activities-page {
                    /* Padding handled by page-container */
                    position: relative;
                }
                
                .activities-title {
                    font-size: 2.5rem;
                    margin: 0;
                    color: var(--text-dark);
                }
                
                .activities-subtitle {
                    color: var(--text-light);
                    margin-top: 0.5rem;
                    font-size: 1.1rem;
                }
                
                .add-activity-btn {
                    white-space: nowrap;
                    padding: 0.8rem 1.5rem;
                    border-radius: 50px;
                }

                .insights-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }

                .insight-stat-card {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.5rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0;
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .stat-icon.completed { background: #E8F5E9; color: #2E7D32; }
                .stat-icon.pending { background: #FFF3E0; color: #EF6C00; }
                .stat-icon.upcoming { background: #E3F2FD; color: #1565C0; }

                .stat-info h3 { margin: 0; font-size: 1.8rem; }
                .stat-info p { margin: 0; color: var(--text-light); font-size: 0.9rem; }

                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                    color: var(--text-dark);
                }

                .activities-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }
                
                .activity-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 2rem;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                }

                .activity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }

                .activity-icon-wrapper {
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    background: var(--bg-light);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    font-size: 1.2rem;
                }

                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: capitalize;
                }

                .status-badge.completed { background: #E8F5E9; color: #2E7D32; }
                .status-badge.pending { background: #FFF3E0; color: #EF6C00; }
                .status-badge.planned { background: #E3F2FD; color: #1565C0; }

                .activity-type {
                    margin: 0 0 0.5rem;
                    font-size: 1.2rem;
                }

                .activity-crop {
                    color: var(--text-light);
                    margin-bottom: 1rem;
                }

                .activity-date {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-light);
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }

                .activity-notes-preview {
                    background: #f8fafc;
                    padding: 0.75rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    border-left: 3px solid #10b981;
                }

                .activity-notes-preview p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: #475569;
                    font-style: italic;
                    line-height: 1.4;
                }

                .activity-footer {
                    margin-top: auto;
                    display: flex;
                    gap: 0.5rem;
                }

                .activity-btn {
                    flex: 1;
                    padding: 0.6rem;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                
                .activity-btn-done {
                    flex: 1.5;
                    padding: 0.6rem;
                    border-radius: 6px;
                }

                .btn-red-outline {
                    border: 1px solid #ef4444;
                    color: #ef4444;
                    background: transparent;
                    width: 40px;
                    flex: 0;
                }
                .btn-red-outline:hover {
                    background: #ef4444;
                    color: white;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    background: white;
                    padding: 2.5rem;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .modal-header h3 { margin: 0; font-size: 1.5rem; }
                .close-btn {
                    background: transparent;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: var(--text-light);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: var(--text-dark);
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 0.8rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                
                .help-text {
                    font-size: 0.8rem;
                    color: var(--text-light);
                    margin-top: 0.2rem;
                }
                
                @media (max-width: 768px) {
                    .header-card {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .add-activity-btn {
                        width: 100%;
                    }

                    .activities-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ActivityTracker;
