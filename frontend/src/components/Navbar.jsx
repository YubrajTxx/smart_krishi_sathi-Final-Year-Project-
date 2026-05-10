import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faHome,
  faChartLine,
  faCloudSun,
  faBookOpen,
  faUser,
  faSignInAlt,
  faBars,
  faTimes,
  faSignOutAlt,
  faTasks,
  faShieldAlt,
  faGlobe,
  faSearch,
  faSync,
  faStickyNote,
  faMapMarkedAlt,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/LanguageContext.jsx';
import { useLocation as useAppLocation } from '../context/LocationContext.jsx';
import LocationPickerModal from './LocationPickerModal.jsx';
import { faMapMarkerAlt as faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getNotifications } from '../api/notificationApi';

const Navbar = ({ onSearchClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, toggleRole } = useAuth();
  const { lang, switchLanguage, t } = useTranslation();
  const { location: appLocation, setLocation } = useAppLocation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleToggleRole = () => {
    toggleRole();
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const notifications = await getNotifications();
          const count = notifications.filter(n => !n.read).length;
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to fetch unread count", error);
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={() => setIsOpen(false)}>
          <div className="brand-icon">
            <FontAwesomeIcon icon={faLeaf} />
          </div>
          <h1>Smart Krishi Sathi</h1>
        </Link>

        {/* Right Side - Navigation Links + Controls */}
        <div className="nav-right">
          {/* Desktop Navigation */}
          <div className="nav-desktop">
              <ul className="navbar-links">
                <li>
                  <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link to="/predict" className={`nav-link ${isActive('/predict') ? 'active' : ''}`}>
                    {t('predict')}
                  </Link>
                </li>
                <li>
                  <Link to="/activities" className={`nav-link ${isActive('/activities') ? 'active' : ''}`}>
                    {t('activities')}
                  </Link>
                </li>
                <li>
                  <Link to="/learn" className={`nav-link ${isActive('/learn') ? 'active' : ''}`}>
                    {t('library')}
                  </Link>
                </li>
                <li>
                  <Link to="/weather" className={`nav-link ${isActive('/weather') ? 'active' : ''}`}>
                    {t('weather')}
                  </Link>
                </li>

                <li>
                  <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`}>
                    {t('map')}
                  </Link>
                </li>
              </ul>
          </div>

          <div className="nav-controls">
            {user && (
              <Link to="/notifications" className="notification-bell-desktop" style={{ position: 'relative', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <button
                  className="control-btn"
                  title={t('notifications')}
                >
                  <FontAwesomeIcon icon={faBell} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                  )}
                </button>
              </Link>
            )}

            {user && (
              <button
                onClick={onSearchClick}
                className="control-btn"
                title={t('search')}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            )}

            <button
              onClick={() => switchLanguage(lang === 'en' ? 'ne' : 'en')}
              className="control-btn lang-btn"
            >
              {lang.toUpperCase()}
            </button>

            {user ? (
              <div className="profile-dropdown-container">
                <button className="profile-trigger" onClick={toggleProfile}>
                  <FontAwesomeIcon icon={faUser} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="dropdown-header">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role} mode</span>
                      </div>

                      <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <FontAwesomeIcon icon={faUser} /> {t('account_settings')}
                      </Link>

                      {user.role === 'admin' && (
                        <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => setIsProfileOpen(false)} style={{ textDecoration: 'none' }}>
                          <FontAwesomeIcon icon={faShieldAlt} /> {t('admin_dashboard')}
                        </a>
                      )}

                      <button className="dropdown-item admin-toggle" onClick={handleToggleRole}>
                        <FontAwesomeIcon icon={faSync} />
                        {user.role === 'admin' ? t('switch_to_farmer') : t('switch_to_admin')}
                      </button>

                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> {t('logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="auth-buttons-desktop">
                <Link to="/login" className="btn-nav-login">
                  <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '6px' }} />
                  {t('login') || 'Login'}
                </Link>
                <Link to="/register" className="btn-nav-register">
                  {t('register') || 'Register'}
                </Link>
              </div>
            )}

            <button className="hamburger-btn" onClick={toggleMenu}>
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        <LocationPickerModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={appLocation}
          onSelect={(loc) => setLocation(loc)}
        />

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="nav-mobile-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                className="nav-mobile-menu"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="mobile-menu-header">
                  <Link to="/" className="nav-brand" onClick={() => setIsOpen(false)}>
                    <div className="brand-icon">
                      <FontAwesomeIcon icon={faLeaf} />
                    </div>
                    <h1>Smart Krishi</h1>
                  </Link>
                  <button className="close-menu" onClick={() => setIsOpen(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="mobile-menu-content">
                  {user && (
                    <div className="mobile-user-profile">
                      <div className="user-avatar-large">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="user-info">
                        <h3>{user.name}</h3>
                        <p>{user.role} mode</p>
                      </div>
                    </div>
                  )}

                  <ul className="mobile-nav-links">
                        <li>
                          <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faHome} /> {t('home')}
                          </Link>
                        </li>
                        <li>
                          <Link to="/predict" className={`mobile-link ${isActive('/predict') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faChartLine} /> {t('predict')}
                          </Link>
                        </li>
                        <li>
                          <Link to="/activities" className={`mobile-link ${isActive('/activities') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTasks} /> {t('activities')}
                          </Link>
                        </li>
                        <li>
                          <Link to="/learn" className={`mobile-link ${isActive('/learn') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faBookOpen} /> {t('library')}
                          </Link>
                        </li>
                        <li>
                          <Link to="/weather" className={`mobile-link ${isActive('/weather') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faCloudSun} /> {t('weather')}
                          </Link>
                        </li>

                        <li>
                          <Link to="/map" className={`mobile-link ${isActive('/map') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faMapMarkedAlt} /> {t('map')}
                          </Link>
                        </li>

                    {user ? (
                      <>
                        <li>
                          <Link to="/notifications" className={`mobile-link ${isActive('/notifications') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                            <div style={{ position: 'relative' }}>
                              <FontAwesomeIcon icon={faBell} />
                              {unreadCount > 0 && (
                                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '1px solid white' }}></span>
                              )}
                            </div>
                            {t('notifications')}
                          </Link>
                        </li>

                        <div className="mobile-divider"></div>

                        <li>
                          <Link to="/profile" className="mobile-link" onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faUser} /> {t('account_settings')}
                          </Link>
                        </li>
                        {user.role === 'admin' && (
                          <li>
                            <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="mobile-link" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                              <FontAwesomeIcon icon={faShieldAlt} /> {t('admin_dashboard')}
                            </a>
                          </li>
                        )}
                        <li>
                          <button className="mobile-link toggle-btn" onClick={handleToggleRole}>
                            <FontAwesomeIcon icon={faSync} />
                            {user.role === 'admin' ? t('switch_to_farmer') : t('switch_to_admin')}
                          </button>
                        </li>
                        <li>
                          <button className="mobile-link logout-btn" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} /> {t('logout')}
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/login" className="mobile-link" onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faSignInAlt} /> {t('login')}
                          </Link>
                        </li>
                        <li>
                          <Link to="/register" className="mobile-link register-highlight" onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTasks} /> {t('register')}
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="mobile-menu-footer">
                  <button
                    onClick={() => {
                      switchLanguage(lang === 'en' ? 'ne' : 'en');
                      setIsOpen(false);
                    }}
                    className="mobile-lang-toggle"
                  >
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>{lang === 'en' ? 'नेपालीमा हेर्नुहोस्' : 'Switch to English'}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .navbar {
          background: white;
          padding: 0.75rem 3rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          border-bottom: 1px solid #f1f5f9;
        }

        .nav-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        }

        .nav-brand h1 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-desktop {
        }

        .navbar-links {
          display: flex;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-link:hover {
          color: #10b981;
          background: #f0fdf4;
        }
        
        .nav-link.active {
          color: #10b981;
          background: #ecfdf5;
          font-weight: 600;
        }

        .nav-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .control-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          font-size: 0.9rem;
        }

        .control-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
          border-color: #cbd5e1;
        }

        .lang-btn {
          font-size: 0.7rem;
          font-weight: 700;
          width: auto;
          padding: 0 0.6rem;
        }

        .profile-dropdown-container {
          position: relative;
        }

        .profile-trigger {
          width: 40px;
          height: 40px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: transform 0.2s ease;
        }

        .profile-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 260px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          z-index: 1001;
        }

        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 0.5rem;
        }

        .user-name {
          display: block;
          font-weight: 800;
          color: #1e293b;
          font-size: 1rem;
        }

        .user-role {
          display: block;
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.75rem 1rem;
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 10px;
          transition: all 0.2s ease;
          width: 100%;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .dropdown-item.logout {
          color: #ef4444;
          margin-top: 0.5rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 0.75rem;
        }

        .hamburger-btn {
          display: none;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          cursor: pointer;
          color: #1e293b;
          font-size: 1rem;
        }

        /* Tablet & Large Phone */
        @media (max-width: 992px) {
          .navbar { padding: 0.75rem 1.5rem; }
          .nav-desktop { display: none; }
          .lang-btn, .profile-dropdown-container { display: none; }
          .notification-bell-desktop { display: none !important; }
          .nav-right { gap: 0.75rem; }
          .hamburger-btn { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
          }
          .nav-controls {
            gap: 0.5rem;
          }
          .control-btn {
            width: 38px;
            height: 38px;
          }
        }

        /* Medium Phone */
        @media (max-width: 768px) {
          .navbar { padding: 0.6rem 1rem; }
          .nav-brand h1 {
            font-size: 1.1rem;
          }
          .brand-icon {
            width: 34px;
            height: 34px;
            font-size: 1rem;
          }
          .control-btn, .hamburger-btn {
            width: 36px;
            height: 36px;
          }
        }

        /* Small Phone */
        @media (max-width: 480px) {
          .navbar { padding: 0.5rem 0.75rem; }
          .nav-brand {
            gap: 8px;
          }
          .nav-brand h1 {
            font-size: 1rem;
          }
          .brand-icon {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
            border-radius: 8px;
          }
          .control-btn, .hamburger-btn {
            width: 34px;
            height: 34px;
            border-radius: 8px;
          }
          .nav-controls {
            gap: 0.4rem;
          }
        }

        /* Mobile Menu Styles */
        .nav-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 2000;
        }

        .nav-mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100%;
          background: white;
          box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          z-index: 2001;
        }

        .mobile-menu-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
        }

        .close-menu {
          background: #f8fafc;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          color: #64748b;
          font-size: 1.25rem;
          cursor: pointer;
        }

        .mobile-menu-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .mobile-user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f0fdf4;
          border-radius: 16px;
          margin-bottom: 1.5rem;
        }

        .user-avatar-large {
          width: 48px;
          height: 48px;
          background: #10b981;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .mobile-nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s ease;
          width: 100%;
          border: none;
          background: none;
          text-align: left;
          font-size: 1rem;
          cursor: pointer;
        }

        .mobile-link:hover, .mobile-link.active {
          background: #f1f5f9;
          color: #10b981;
        }

        .mobile-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 1rem 0;
        }

        .logout-btn {
          color: #ef4444;
        }

        .mobile-menu-footer {
          padding: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .mobile-lang-toggle {
          width: 100%;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #475569;
          font-weight: 700;
          font-size: 0.9375rem;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .nav-mobile-menu {
            width: 85%;
          }
          .mobile-menu-content {
            padding: 1rem;
          }
          .mobile-user-profile {
            padding: 0.75rem;
          }
        }

        @media (max-width: 400px) {
          .nav-mobile-menu {
            width: 95%;
          }
          .mobile-link {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
        }

        .auth-buttons-desktop {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-nav-login {
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          font-size: 0.9375rem;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .btn-nav-login:hover {
          color: #10b981;
          background: #f8fafc;
        }

        .btn-nav-register {
          text-decoration: none;
          color: white;
          background: #10b981;
          font-weight: 600;
          font-size: 0.9375rem;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          transition: all 0.2s ease;
        }

        .btn-nav-register:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 992px) {
          .auth-buttons-desktop {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default React.memo(Navbar);
