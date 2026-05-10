import React from 'react';
import { useTranslation } from '../i18n/LanguageContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const LanguageSwitcher = () => {
    const { lang, switchLanguage } = useTranslation();

    return (
        <div className="language-switcher" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <button
                onClick={() => switchLanguage('en')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: lang === 'en' ? 'white' : 'transparent',
                    color: lang === 'en' ? '#0f172a' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: lang === 'en' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                    transition: '0.2s'
                }}
            >
                EN
            </button>
            <button
                onClick={() => switchLanguage('ne')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: lang === 'ne' ? 'white' : 'transparent',
                    color: lang === 'ne' ? '#0f172a' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: lang === 'ne' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                    transition: '0.2s'
                }}
            >
                नेपाली
            </button>
        </div>
    );
};

export default LanguageSwitcher;
