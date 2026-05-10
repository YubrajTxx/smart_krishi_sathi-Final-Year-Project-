import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faTwitter,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext.jsx';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer" style={{ background: '#064e3b', color: 'white', padding: '4rem 1rem 2rem' }}>
      <div className="footer-content grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', textAlign: 'left', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
         <div>
          <h3 style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '800' }}>Smart Krishi Sathi</h3>
          <p style={{ opacity: 0.8, marginTop: '1.5rem', lineHeight: '1.7' }}>{t('footer_desc')}</p>
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>{t('quick_links')}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <Link to="/about" className="footer-link">{t('about_us')}</Link>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">{t('privacy_policy')}</Link>
            </li>
            <li>
              <Link to="/terms" className="footer-link">{t('terms_of_service')}</Link>
            </li>
            <li>
              <Link to="/support" className="footer-link">{t('contact_support')}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>{t('contact_us')}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8 }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: '#10b981' }} /> support@krishisathi.com
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8 }}>
              <FontAwesomeIcon icon={faPhone} style={{ color: '#10b981' }} /> +977 123456789
            </li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', opacity: 0.7 }}>
        <p>{t('copyright_text')}</p>
      </div>

      <style jsx>{`
        .footer-link {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          font-weight: 500;
        }
        .footer-link:hover {
          color: #10b981;
          transform: translateX(5px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
