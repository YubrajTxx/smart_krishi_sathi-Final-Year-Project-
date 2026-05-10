import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faMapMarkerAlt,
  faUserPlus,
  faLeaf,
  faPhone,

  faArrowLeft,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/LanguageContext.jsx';
import SearchableSelect from '../components/SearchableSelect.jsx';
import { nepalDistricts } from '../utils/districts';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    role: 'farmer',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });


  const validatePassword = (value) => {
    setPasswordCriteria({
      length: value.length >= 10,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { length, upper, lower, number, special } = passwordCriteria;
    if (!length || !upper || !lower || !number || !special) {
      return setError('Please meet all password requirements.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const user = await register(formData);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) {
        // Handle Django DRF field errors or general errors
        const errorData = err.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          // Flatten all error messages into a single array and take the first one
          const allErrors = Object.values(errorData).flat();
          const firstError = allErrors[0] || 'Registration failed. Please check your inputs.';
          // Capitalize first letter
          setError(firstError.charAt(0).toUpperCase() + firstError.slice(1));
        } else {
          const errorMessage = errorData || 'Registration failed. Please try again.';
          setError(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
        }
      } else {
        setError('Registration failed. Server may be unreachable.');
      }
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
        className="auth-card-container wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
            <h2>{formData.role === 'admin' ? t('admin_gateway') : t('create_your_account')}</h2>
            <p>{formData.role === 'admin' ? t('create_admin_desc') : t('empowering_farmers_desc')}</p>
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
            <div className="auth-grid">
              <div className="auth-input-group">
                <label><FontAwesomeIcon icon={faUser} className="mr-2" /> {t('full_name')}</label>
                <div className="input-wrapper">
                  <input type="text" name="name" placeholder={t('enter_full_name')} required value={formData.name} onChange={handleChange} />
                </div>
              </div>

              <div className="auth-input-group">
                <label><FontAwesomeIcon icon={faEnvelope} className="mr-2" /> {t('email_address')}</label>
                <div className="input-wrapper">
                  <input type="email" name="email" placeholder="example@email.com" required value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="auth-input-group">
                <label><FontAwesomeIcon icon={faPhone} className="mr-2" /> {t('phone_number_label')}</label>
                <div className="input-wrapper">
                  <input type="text" name="phone" placeholder="+977-XXXXXXXXXX" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="auth-input-group" style={{ gridColumn: '1 / -1' }}>
                <SearchableSelect
                  label={t('district')}
                  name="district"
                  value={formData.district}
                  options={nepalDistricts}
                  onChange={handleChange}
                  placeholder={t('search_select_district')}
                />
              </div>

              <div className="auth-input-group" style={{ gridColumn: '1 / -1' }}>
                <label><FontAwesomeIcon icon={faUserPlus} className="mr-2" /> {t('app_role')}</label>
                <div className="input-wrapper">
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="farmer">{t('farmer_option')}</option>
                    <option value="admin">{t('admin_option')}</option>
                  </select>
                </div>
              </div>

              <div className="auth-input-group">
                <label><FontAwesomeIcon icon={faLock} className="mr-2" /> {t('password_label')}</label>
                <div className="input-wrapper">
                  <input type="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                </div>
              </div>

              <div className="auth-input-group">
                <label><FontAwesomeIcon icon={faLock} className="mr-2" /> {t('confirm_password')}</label>
                <div className="input-wrapper">
                  <input type="password" name="confirmPassword" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>


            <div className="password-requirements">
              <p>{t('password_requirements_title')}</p>
              <ul>
                <li className={passwordCriteria.length ? 'valid' : ''}>
                  <FontAwesomeIcon icon={passwordCriteria.length ? faCheckCircle : faTimesCircle} /> {t('at_least_10_chars')}
                </li>
                <li className={passwordCriteria.upper ? 'valid' : ''}>
                  <FontAwesomeIcon icon={passwordCriteria.upper ? faCheckCircle : faTimesCircle} /> {t('uppercase_letter')}
                </li>
                <li className={passwordCriteria.lower ? 'valid' : ''}>
                  <FontAwesomeIcon icon={passwordCriteria.lower ? faCheckCircle : faTimesCircle} /> {t('lowercase_letter')}
                </li>
                <li className={passwordCriteria.number ? 'valid' : ''}>
                  <FontAwesomeIcon icon={passwordCriteria.number ? faCheckCircle : faTimesCircle} /> {t('number_rule')}
                </li>
                <li className={passwordCriteria.special ? 'valid' : ''}>
                  <FontAwesomeIcon icon={passwordCriteria.special ? faCheckCircle : faTimesCircle} /> {t('special_char')}
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ padding: '1.25rem' }}
            >
              {loading ? t('creating_account') : t('get_started_free')}
              {!loading && <FontAwesomeIcon icon={faUserPlus} className="ml-2" />}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {t('already_using_smart_krishi')} <Link to="/login">{t('sign_in_dashboard')}</Link>
            </p>
          </div>
        </div>
      </motion.div >

      <style jsx="true">{`
        .auth-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          padding: 2rem 1.5rem;
        }

        .auth-error {
          background: #fee2e2;
          color: #dc2626;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1px solid #fecaca;
          font-size: 0.95rem;
          font-weight: 700;
          text-align: center;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.05);
        }

        .auth-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2600&q=80') center/cover no-repeat;
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
        }

        .auth-card-container.wide {
          max-width: 800px;
        }

        .auth-card {
          background: white;
          padding: 3.5rem;
          border-radius: 32px;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 3rem;
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
          width: 64px;
          height: 64px;
          background: #10b981;
          color: white;
          border-radius: 16px;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 15px -3px rgba(16, 185, 129, 0.3);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .auth-logo:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .auth-header h2 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .auth-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .auth-input-group label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          display: flex;
          align-items: center;
        }

        .input-wrapper input, .input-wrapper select {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: #f8fafc;
          color: #1e293b;
        }

        .input-wrapper select {
          appearance: none;
          background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") no-repeat right 1rem center;
          background-size: 1.5em;
        }

        .input-wrapper input:focus, .input-wrapper select:focus {
          outline: none;
          border-color: #10b981;
          background: white;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .auth-submit-btn {
          width: 100%;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

        .auth-footer {
          margin-top: 3rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .auth-footer p {
          color: #64748b;
          font-weight: 500;
        }

        .auth-footer a {
          color: #10b981;
          font-weight: 800;
          text-decoration: none;
        }

        .mr-2 { margin-right: 0.5rem; }
        .ml-2 { margin-left: 0.5rem; }

        @media (max-width: 768px) {
          .auth-grid {
            grid-template-columns: 1fr;
          }
          .auth-card {
            padding: 2.5rem 1.5rem;
          }
        }

        .password-requirements {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }

        .password-requirements p {
           font-size: 0.85rem;
           font-weight: 700;
           color: #64748b;
           margin-bottom: 0.5rem;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .password-requirements li {
          font-size: 0.8rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .password-requirements li.valid {
          color: #10b981;
          font-weight: 600;
        }
      `}</style>
    </div >
  );
};

export default Register;
