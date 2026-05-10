import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const TermsOfService = () => {
    const { t } = useTranslation();
    return (
        <div className="page-container legal-page" style={{ padding: '4rem 2.5rem', maxWidth: '900px', margin: '0 auto' }}>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '4rem' }}
            >
                <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>{t('terms_of_service_title')}</h1>
                <p style={{ color: 'var(--text-light)' }}>{t('effective_date')}</p>
            </motion.header>

            <motion.div
                className="legal-content card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ padding: '3rem', borderRadius: '24px', lineHeight: '1.8', color: '#475569' }}
            >
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('terms_sec1_title')}</h2>
                    <p>{t('terms_sec1_desc')}</p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('terms_sec2_title')}</h2>
                    <p>{t('terms_sec2_desc')}</p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('terms_sec3_title')}</h2>
                    <p>{t('terms_sec3_desc1')}</p>
                    <p>{t('terms_sec3_desc2')}</p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('terms_sec4_title')}</h2>
                    <p>{t('terms_sec4_desc')}</p>
                </section>

                <section>
                    <h2 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('terms_sec5_title')}</h2>
                    <p>{t('terms_sec5_desc')}</p>
                </section>
            </motion.div>

            <style jsx>{`
                .legal-page {
                    padding: 4rem 2.5rem;
                }
                
                @media (max-width: 768px) {
                    .legal-page { padding: 3rem 1.5rem; }
                    .legal-page header { marginBottom: 2.5rem !important; }
                    .legal-page h1 { font-size: 2.2rem !important; }
                    .legal-content { padding: 2rem !important; }
                    .legal-content h2 { font-size: 1.3rem !important; }
                }

                @media (max-width: 480px) {
                    .legal-page { padding: 2rem 1rem; }
                    .legal-page h1 { font-size: 1.8rem !important; }
                    .legal-content { padding: 1.5rem !important; border-radius: 16px !important; }
                    .legal-content p, .legal-content li { font-size: 0.95rem; }
                }
            `}</style>
        </div>
    );
};

export default TermsOfService;
