import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../i18n/LanguageContext.jsx';

const SearchableSelect = ({ options, value, onChange, placeholder = "Select...", label, name }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange({ target: { name, value: option } });
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="searchable-select-container" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem', color: '#334155' }}>{label}</label>}

            <div
                className={`select-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
            >
                <span style={{ color: value ? '#1e293b' : '#94a3b8' }}>
                    {value || placeholder}
                </span>
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.8rem', color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ padding: '0.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: '#94a3b8', fontSize: '0.9rem' }} />
                            <input
                                type="text"
                                autoFocus
                                placeholder={t('search_districts_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    color: '#1e293b'
                                }}
                            />
                            {searchTerm && (
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }}
                                    style={{ color: '#94a3b8', cursor: 'pointer' }}
                                />
                            )}
                        </div>

                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => handleSelect(option)}
                                        style={{
                                            padding: '0.75rem 1.25rem',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            color: value === option ? 'var(--primary)' : '#475569',
                                            background: value === option ? '#ecfdf5' : 'transparent',
                                            fontWeight: value === option ? '700' : '500',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = value === option ? '#ecfdf5' : '#f8fafc'}
                                        onMouseLeave={(e) => e.target.style.background = value === option ? '#ecfdf5' : 'transparent'}
                                    >
                                        {option}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    {t('no_districts_found')}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .select-trigger:hover {
          border-color: #cbd5e1;
        }
        .select-trigger.open {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
      `}</style>
        </div>
    );
};

export default SearchableSelect;
