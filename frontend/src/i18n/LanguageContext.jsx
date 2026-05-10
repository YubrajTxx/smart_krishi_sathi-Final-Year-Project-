import React, { createContext, useState, useContext, useEffect } from 'react';
import en from './en.json';
import ne from './ne.json';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');
    const [translations, setTranslations] = useState(en);

    useEffect(() => {
        const savedLang = localStorage.getItem('krishi_lang');
        if (savedLang) {
            setLang(savedLang);
            setTranslations(savedLang === 'en' ? en : ne);
        }
    }, []);

    const switchLanguage = (newLang) => {
        setLang(newLang);
        setTranslations(newLang === 'en' ? en : ne);
        localStorage.setItem('krishi_lang', newLang);
    };

    const t = (key, params = {}) => {
        let text = translations[key] || key;
        Object.keys(params).forEach(p => {
            text = text.replace(`{${p}}`, params[p]);
        });
        return text;
    };

    return (
        <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
