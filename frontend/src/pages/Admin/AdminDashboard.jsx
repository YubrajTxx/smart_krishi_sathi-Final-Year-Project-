import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faSeedling,
    faDatabase,
    faChartBar,
    faTools,
    faEdit,
    faTrash,
    faPlus
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Farmers', value: '1,240', icon: faUsers, color: '#2196F3' },
        { label: 'Active Crops', value: '56', icon: faSeedling, color: '#4CAF50' },
        { label: 'Analyzes Run', value: '8,432', icon: faDatabase, color: '#FF9800' }
    ];

    return (
        <div className="section-container" style={{ padding: '3rem 0' }}>
            <header style={{ marginBottom: '3rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem' }}>Admin Control Center</h2>
                <p style={{ color: 'var(--text-light)' }}>System management, data editing, and statistics.</p>
            </header>

            {/* Stats Section */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {stats.map((s, idx) => (
                    <motion.div
                        key={idx}
                        className="card"
                        style={{ textAlign: 'center', padding: '2rem' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <FontAwesomeIcon icon={s.icon} style={{ fontSize: '2.5rem', color: s.color, marginBottom: '1rem' }} />
                        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{s.value}</h1>
                        <p style={{ color: 'var(--text-light)', fontWeight: '600', marginTop: '0.5rem' }}>{s.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginTop: '4rem' }}>
                {/* Management Card */}
                <div className="card">
                    <h3 style={{ marginBottom: '2rem' }}><FontAwesomeIcon icon={faTools} /> Global Management</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-light)', borderRadius: '12px' }}>
                            <span>User Database</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href="http://localhost:8000/admin/accounts/user/" target="_blank" rel="noopener noreferrer" className="btn btn-blue-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                                    <FontAwesomeIcon icon={faEdit} /> Manage
                                </a>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-light)', borderRadius: '12px' }}>
                            <span>Crop Library (CRUD)</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href="http://localhost:8000/admin/crops/crop/" target="_blank" rel="noopener noreferrer" className="btn btn-green" style={{ padding: '4px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                                    <FontAwesomeIcon icon={faPlus} /> Add New
                                </a>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-light)', borderRadius: '12px' }}>
                            <span>Regional Information</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href="http://localhost:8000/admin/mapdata/locationstat/" target="_blank" rel="noopener noreferrer" className="btn btn-blue-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </a>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="btn btn-blue" style={{ width: '100%', textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                                Open Django Admin Panel
                            </a>
                        </div>
                    </div>
                </div>

                {/* Analytics Summary */}
                <div className="card">
                    <h3 style={{ marginBottom: '2rem' }}><FontAwesomeIcon icon={faChartBar} /> System Health</h3>
                    <div style={{ padding: '1rem', background: '#F5F5F5', borderRadius: '12px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>Live user activity chart would be rendered here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
