import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faLeaf, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/LanguageContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-overlay"></div>
      </div>

      <motion.div
        className="auth-card-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-card">
          <Link to="/" className="back-to-splash">
            <FontAwesomeIcon icon={faArrowLeft} /> <span>{t('back')}</span>
          </Link>
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <FontAwesomeIcon icon={faLeaf} />
            </Link>
            <h2>{t('welcome_back')}</h2>
            <p>{t('credentials_desc')}</p>
          </div>

          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="email">{t('email_address')}</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="label-flex">
                <label htmlFor="password">{t('password_label')}</label>
                <Link to="/forgot-password">{t('forgot_password')}</Link>
              </div>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? t('authenticating') : t('sign_in')}
              {!loading && <FontAwesomeIcon icon={faSignInAlt} className="ml-2" />}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {t('new_to_smart_krishi')} <Link to="/register">{t('create_account')}</Link>
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx="true">{`
        .auth-page {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          overflow: hidden;
        }

        .auth-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: url('https://images.unsplash.com/photo-1495107334309-fcf20504fa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2600&q=80') center/cover no-repeat;
        }

        .auth-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(16, 185, 129, 0.1) 100%);
          backdrop-filter: blur(8px);
        }

        .auth-card-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          padding: 1.5rem;
        }

        .auth-card {
          background: white;
          padding: 3rem;
          border-radius: 32px;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .back-to-splash {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          z-index: 20;
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          background: #f8fafc;
        }

        .back-to-splash:hover {
          color: #10b981;
          background: #ecfdf5;
          transform: translateX(-4px);
        }

        .auth-logo {
          display: inline-flex;
          width: 56px;
          height: 56px;
          background: #10b981;
          color: white;
          border-radius: 14px;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 15px -3px rgba(16, 185, 129, 0.3);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .auth-logo:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .auth-header h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .auth-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 0.875rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          text-align: center;
          font-weight: 600;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .label-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label-flex a {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #10b981;
          text-decoration: none;
        }

        .auth-input-group label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .input-wrapper input {
          width: 100%;
          padding: 1rem 1.25rem 1rem 3.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: #f8fafc;
          color: #1e293b;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #10b981;
          background: white;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .input-wrapper input:focus + .input-icon,
        .input-wrapper:focus-within .input-icon {
          color: #10b981;
        }

        .auth-submit-btn {
          background: #10b981;
          color: white;
          padding: 1.125rem;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1.05rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin-top: 1rem;
          box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-submit-btn:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .auth-footer {
          margin-top: 2.5rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .auth-footer p {
          color: #64748b;
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .auth-footer a {
          color: #10b981;
          font-weight: 800;
          text-decoration: none;
        }

        .ml-2 { margin-left: 0.75rem; }

        @media (max-width: 640px) {
          .auth-card {
            padding: 2.25rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
