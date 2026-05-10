import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSeedling,
    faUsers,
    faChartLine,
    faGlobe,
    faHandshake,
    faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const About = () => {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const missionItems = [
        {
            icon: faSeedling,
            title: t('sustainable_growth'),
            desc: t('sustainable_growth_desc')
        },
        {
            icon: faUsers,
            title: t('farmer_empowerment'),
            desc: t('farmer_empowerment_desc')
        },
        {
            icon: faLightbulb,
            title: t('innovation'),
            desc: t('innovation_desc')
        }
    ];

    return (
        <div className="page-container about-page" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.section
                className="about-hero"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', marginBottom: '6rem' }}
            >
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                    {t('cultivating_future')}
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                    {t('about_desc')}
                </p>
            </motion.section>

            <motion.section
                className="mission-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '8rem' }}
            >
                {missionItems.map((item, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="card mission-card"
                        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '24px' }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: '#E8F5E9',
                            color: '#2E7D32',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            margin: '0 auto 1.5rem'
                        }}>
                            <FontAwesomeIcon icon={item.icon} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>{item.desc}</p>
                    </motion.div>
                ))}
            </motion.section>

            <section className="our-story" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{t('our_story')}</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                        {t('our_story_p1')}
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.8' }}>
                        {t('our_story_p2')}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047)', height: '400px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '10rem', color: 'rgba(255,255,255,0.2)' }} />
                </motion.div>
            </section>

            <motion.section
                className="stats-banner"
                style={{
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '32px',
                    padding: '4rem',
                    textAlign: 'center',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem'
                }}
            >
                <div>
                    <h4 style={{ fontSize: '2.5rem', margin: 0 }}>10k+</h4>
                    <p style={{ opacity: 0.8 }}>{t('active_farmers')}</p>
                </div>
                <div>
                    <h4 style={{ fontSize: '2.5rem', margin: 0 }}>50+</h4>
                    <p style={{ opacity: 0.8 }}>{t('districts_covered')}</p>
                </div>
                <div>
                    <h4 style={{ fontSize: '2.5rem', margin: 0 }}>95%</h4>
                    <p style={{ opacity: 0.8 }}>{t('accuracy_rate')}</p>
                </div>
                <div>
                    <h4 style={{ fontSize: '2.5rem', margin: 0 }}>24/7</h4>
                    <p style={{ opacity: 0.8 }}>{t('support_24_7')}</p>
                </div>
            </motion.section>

            <style jsx>{`
                .about-page {
                    padding: 4rem 2rem;
                }

                @media (max-width: 1024px) {
                    .about-hero h1 { font-size: 3rem; }
                    .stats-banner { padding: 3rem; }
                }

                @media (max-width: 768px) {
                    .about-page { padding: 2.5rem 1.25rem; }
                    .about-hero { margin-bottom: 3rem !important; }
                    .about-hero h1 { font-size: 2.2rem; }
                    .about-hero p { font-size: 1.05rem; line-height: 1.6; }
                    
                    .mission-grid { 
                        grid-template-columns: 1fr !important;
                        gap: 1.25rem !important; 
                        margin-bottom: 4rem !important;
                    }
                    .mission-card { padding: 1.75rem !important; }
                    
                    .our-story { 
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                        margin-bottom: 4rem !important;
                    }
                    .our-story h2 { font-size: 1.8rem !important; margin-bottom: 1rem !important; white-space: nowrap; }
                    .our-story p { font-size: 1.05rem !important; }
                    .our-story div:last-child { height: 260px !important; border-radius: 24px !important; order: -1; }
                    
                    .stats-banner { 
                        grid-template-columns: 1fr 1fr !important; 
                        padding: 2rem 1rem !important;
                        border-radius: 20px !important;
                        gap: 1.5rem !important;
                    }
                    .stats-banner h4 { font-size: 1.5rem !important; }
                    .stats-banner p { font-size: 0.85rem; }
                }

                @media (max-width: 480px) {
                    .about-page { padding: 1.5rem 1rem; }
                    .about-hero { margin-bottom: 2.5rem !important; }
                    .about-hero h1 { font-size: 1.85rem; }
                    .about-hero p { font-size: 0.95rem; }
                    
                    .mission-grid { margin-bottom: 3.5rem !important; }
                    .mission-card { padding: 1.5rem !important; }
                    
                    .stats-banner { 
                        padding: 1.5rem 1rem !important;
                        gap: 1rem !important;
                    }
                }

                @media (max-width: 360px) {
                    .about-hero h1 { font-size: 1.6rem; }
                    .our-story h2 { font-size: 1.6rem !important; }
                    .stats-banner { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default About;
