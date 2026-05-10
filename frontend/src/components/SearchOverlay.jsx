import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faTimes,
    faSeedling,
    faStickyNote,
    faTasks,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../i18n/LanguageContext.jsx';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Mock data for search
    const searchableItems = [
        { id: 1, title: 'Rice Cultivation', type: 'Library', link: '/learn', icon: faSeedling },
        { id: 2, title: 'Maize Season Tips', type: 'Library', link: '/learn', icon: faSeedling },
        { id: 4, title: 'Plow Hilly Region', type: 'Activities', link: '/activities', icon: faTasks }
    ];

    const results = query ? searchableItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    ) : [];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="search-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255,255,255,0.98)',
                        zIndex: 2000,
                        padding: '5rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '2rem', right: '2rem', fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>

                    <div style={{ maxWidth: '800px', width: '100%' }}>
                        <div style={{ position: 'relative', marginBottom: '3rem' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', fontSize: '2rem', opacity: 0.2 }} />
                            <input
                                autoFocus
                                type="text"
                                placeholder={t('search_placeholder')}
                                style={{
                                    width: '100%',
                                    padding: '2rem 2rem 2rem 5rem',
                                    fontSize: '2rem',
                                    border: 'none',
                                    borderBottom: '4px solid var(--primary)',
                                    background: 'none',
                                    outline: 'none'
                                }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {results.length > 0 ? (
                                results.map(res => (
                                    <motion.div
                                        key={res.id}
                                        className="card"
                                        whileHover={{ scale: 1.01, background: '#f9f9f9' }}
                                        style={{ cursor: 'pointer', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        onClick={() => {
                                            navigate(res.link);
                                            onClose();
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <FontAwesomeIcon icon={res.icon} style={{ fontSize: '1.5rem', color: 'var(--primary)', opacity: 0.5 }} />
                                            <div>
                                                <h4 style={{ margin: 0 }}>{res.title}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>{res.type}</span>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faArrowRight} style={{ opacity: 0.3 }} />
                                    </motion.div>
                                ))
                            ) : query ? (
                                <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>{t('no_results')} "{query}"</p>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#999', marginTop: '4rem' }}>
                                    <p>{t('try_searching')} "Rice", "Activities", or "Maize"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
