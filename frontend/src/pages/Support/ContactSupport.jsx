import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { sendSupportMessage } from '../../api/supportApi';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { useEffect } from 'react';

const ContactSupport = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');
        setErrorMsg('');

        try {
            await sendSupportMessage(formData);
            setFormStatus('success');
            setFormData({ full_name: '', email: '', subject: '', message: '' });
            setTimeout(() => setFormStatus('idle'), 5000);
        } catch (error) {
            setFormStatus('error');
            setErrorMsg(error.response?.data?.message || t('something_went_wrong'));
            setTimeout(() => setFormStatus('idle'), 5000);
        }
    };

    return (
        <div className="page-container support-page" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '5rem' }}
            >
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>
                    {t('how_can_help')}
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
                    {t('support_team_desc')}
                </p>
            </motion.section>

            <div className="support-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '4rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card" style={{ padding: '2.5rem', borderRadius: '32px', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{t('contact_info')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="info-card-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div className="info-card-icon" style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#F0F9FF', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>{t('email_us')}</p>
                                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem', wordBreak: 'break-all' }}>support@krishisathi.com</p>
                                </div>
                            </div>
                            <div className="info-card-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div className="info-card-icon" style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>{t('call_us')}</p>
                                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>+977 1-4567890</p>
                                </div>
                            </div>
                            <div className="info-card-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div className="info-card-icon" style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>{t('visit_us')}</p>
                                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>{t('kathmandu_nepal')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card" style={{ padding: '3rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{t('send_message')}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('full_name')}</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                        placeholder={t('full_name')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('email_address')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('subject')}</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                    placeholder={t('subject')}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('message')}</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', minHeight: '150px' }}
                                    placeholder={t('message_details_placeholder')}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className={`btn`}
                                disabled={formStatus === 'sending'}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s',
                                    backgroundColor: formStatus === 'success' ? '#10B981' : (formStatus === 'error' ? '#EF4444' : 'var(--primary)'),
                                    color: 'white',
                                    border: 'none',
                                    cursor: formStatus === 'sending' ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {formStatus === 'idle' && <><FontAwesomeIcon icon={faPaperPlane} /> {t('send_message')}</>}
                                {formStatus === 'sending' && <>{t('sending')}</>}
                                {formStatus === 'success' && <>{t('message_sent_success')}</>}
                                {formStatus === 'error' && <>{t('failed_to_send')}</>}
                            </button>
                            {formStatus === 'error' && (
                                <p style={{ color: '#EF4444', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>{errorMsg}</p>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .support-page {
                    padding: 4rem 2rem;
                }

                @media (max-width: 992px) {
                    .support-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    .support-page h1 { font-size: 2.5rem !important; }
                }

                @media (max-width: 768px) {
                    .support-page { padding: 2.5rem 1.25rem; }
                    .support-page section { marginBottom: 2.5rem !important; }
                    .support-page h1 { font-size: 2rem !important; }
                    .support-page p { font-size: 1.05rem; }
                    
                    .card { 
                        padding: 1.75rem !important; 
                        border-radius: 24px !important; 
                    }
                    
                    form div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                        gap: 1.25rem !important;
                    }

                    .info-card-item { gap: 1rem !important; }
                    .info-card-icon { width: 44px !important; height: 44px !important; }
                }

                @media (max-width: 480px) {
                    .support-page { padding: 1.5rem 1rem; }
                    .support-page h1 { font-size: 1.75rem !important; }
                    .card { padding: 1.25rem !important; border-radius: 16px !important; }
                    
                    .form-group label { font-size: 0.85rem; margin-bottom: 0.4rem !important; }
                    .form-group input, .form-group textarea { padding: 0.65rem 0.85rem !important; font-size: 0.9rem; border-radius: 10px !important; }
                    
                    .btn { padding: 0.75rem !important; font-size: 0.9rem; border-radius: 10px !important; }
                    
                    .support-grid { gap: 1.5rem !important; }
                }

                @media (max-width: 360px) {
                    .support-page h1 { font-size: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
};

export default ContactSupport;
