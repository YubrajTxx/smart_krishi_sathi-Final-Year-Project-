import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faEdit,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faSignOutAlt,
  faHistory,
  faLock,
  faCamera,
  faLanguage,
  faCheckCircle,
  faTimes,
  faCheck,
  faImage,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, changePassword } from '../../api/authApi';
import SearchableSelect from '../../components/SearchableSelect';
import { nepalDistricts } from '../../utils/districts';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import './Profile.css';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:8000${url}`;
};

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(user?.profile_image || null);
  const [bannerImage, setBannerImage] = useState(user?.banner_image || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showRegionalModal, setShowRegionalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [regionalSettings, setRegionalSettings] = useState({
    timezone: user?.timezone || 'Asia/Kathmandu',
    dateFormat: user?.date_format || 'DD/MM/YYYY'
  });

  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    district: user?.district || ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Sync state with user data if it changes
  useEffect(() => {
    if (user) {
      setProfileImage(user.profile_image);
      setBannerImage(user.banner_image);
      setRegionalSettings({
        timezone: user.timezone || 'Asia/Kathmandu',
        dateFormat: user.date_format || 'DD/MM/YYYY'
      });
      setEditFormData({
        name: user.name || '',
        phone: user.phone || '',
        district: user.district || ''
      });
    }
  }, [user]);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_image', file);
      try {
        const updatedUser = await updateUserProfile(formData);
        setUser({ ...updatedUser, token: user.token });
      } catch (error) {
        console.error("Failed to update profile image", error);
        alert("Failed to update profile image");
      }
    }
  };

  const handleBannerImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('banner_image', file);
      try {
        const updatedUser = await updateUserProfile(formData);
        setUser({ ...updatedUser, token: user.token });
      } catch (error) {
        console.error("Failed to update banner image", error);
        alert("Failed to update banner image");
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(editFormData);
      setUser({ ...updatedUser, token: user.token });
      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    }
  };

  const handleRegionalSubmit = async () => {
    try {
      const updatedUser = await updateUserProfile({
        timezone: regionalSettings.timezone,
        date_format: regionalSettings.dateFormat
      });
      setUser({ ...updatedUser, token: user.token });
      setShowRegionalModal(false);
      alert('Regional settings updated!');
    } catch (error) {
      console.error("Failed to update regional settings", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match!');
      return;
    }

    try {
      await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      });
      alert('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error("Failed to change password", error);
      const errorMsg = error.response?.data ? Object.values(error.response.data).flat().join(', ') : "Failed to change password";
      alert(errorMsg);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-container section-container">
      <motion.div
        className="profile-card card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header Banner */}
        <div className="profile-banner" style={{
          background: bannerImage ? `url(${getImageUrl(bannerImage)}) center/cover` : 'linear-gradient(135deg, var(--primary) 0%, #1B5E20 100%)'
        }}>
          <button onClick={() => bannerInputRef.current.click()} className="banner-change-btn">
            <FontAwesomeIcon icon={faImage} /> {t('change_banner')}
          </button>
          <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerImageChange} style={{ display: 'none' }} />

          <div className="profile-picture-container">
            <div style={{ position: 'relative' }}>
              {profileImage ? (
                <img src={getImageUrl(profileImage)} alt="Profile" className="profile-picture" />
              ) : (
                <div className="profile-picture" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                  <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '100px', color: '#cbd5e1' }} />
                </div>
              )}
              <button onClick={() => profileInputRef.current.click()} className="camera-btn">
                <FontAwesomeIcon icon={faCamera} />
              </button>
              <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileImageChange} style={{ display: 'none' }} />
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-info-section">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '0.5rem' }}>
                <h2 className="profile-name">{user?.name || 'Ram Bahadur'}</h2>
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--primary)', fontSize: '1.5rem' }} title={t('verified_farmer')} />
              </div>
              <p className="profile-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--primary)' }} />
                {user?.district || t('nepal')}
              </p>
              <div className="profile-actions">
                <button className="btn btn-green" onClick={() => setShowEditModal(true)}><FontAwesomeIcon icon={faEdit} /> {t('edit_profile')}</button>
                <button className="btn btn-blue-outline" onClick={() => navigate('/activities')}><FontAwesomeIcon icon={faHistory} /> {t('activity_log')}</button>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="card" style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: '700' }}>{t('identity_details')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="identity-item">
                  <span className="identity-label">{t('email_address')}</span>
                  <span className="identity-value"><FontAwesomeIcon icon={faEnvelope} /> {user?.email}</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">{t('phone_number_label')}</span>
                  <span className="identity-value"><FontAwesomeIcon icon={faPhone} /> {user?.phone || t('not_provided')}</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">{t('district')}</span>
                  <span className="identity-value membership-tag">{user?.district || t('not_provided')}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: '700' }}>{t('security_config')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <button onClick={() => setShowPasswordModal(true)} className="btn btn-blue-outline security-btn">
                  <FontAwesomeIcon icon={faLock} style={{ marginRight: '10px', color: '#3B82F6' }} /> {t('change_password')}
                </button>
                <button onClick={() => setShowRegionalModal(true)} className="btn btn-blue-outline security-btn">
                  <FontAwesomeIcon icon={faLanguage} style={{ marginRight: '10px', color: '#3B82F6' }} /> {t('regional_settings')}
                </button>
                <button onClick={() => setShowSignOutModal(true)} className="btn" style={{ background: '#ef4444', color: 'white', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> {t('sign_out_app')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {/* Change Password Modal */}
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPasswordModal(false)} className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} onClick={(e) => e.stopPropagation()} className="modal-content-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>{t('change_password')}</h2>
                <button onClick={() => setShowPasswordModal(false)} className="close-btn"><FontAwesomeIcon icon={faTimes} /></button>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <input
                    type="password"
                    placeholder={t('current_password')}
                    required
                    className="form-input"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder={t('new_password')}
                    required
                    className="form-input"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder={t('confirm_new_password')}
                    required
                    className="form-input"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-blue-outline" style={{ flex: 1 }}>{t('cancel')}</button>
                    <button type="submit" className="btn btn-green" style={{ flex: 1 }}>{t('update_password')}</button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} onClick={(e) => e.stopPropagation()} className="modal-content-box" style={{ maxWidth: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>{t('edit_profile')}</h2>
                <button onClick={() => setShowEditModal(false)} className="close-btn"><FontAwesomeIcon icon={faTimes} /></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <input type="text" placeholder={t('full_name')} value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required className="form-input" />
                  <input type="text" placeholder={t('phone_number_label')} value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} className="form-input" />
                  <SearchableSelect
                    options={nepalDistricts}
                    value={editFormData.district}
                    onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                    placeholder={t('search_district')}
                    label={t('district')}
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-blue-outline" style={{ flex: 1 }}>{t('cancel')}</button>
                    <button type="submit" className="btn btn-green" style={{ flex: 1 }}>{t('save_changes')}</button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Regional Settings Modal */}
        {showRegionalModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegionalModal(false)} className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} onClick={(e) => e.stopPropagation()} className="modal-content-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>{t('regional_settings')}</h2>
                <button onClick={() => setShowRegionalModal(false)} className="close-btn"><FontAwesomeIcon icon={faTimes} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <select value={regionalSettings.timezone} onChange={(e) => setRegionalSettings({ ...regionalSettings, timezone: e.target.value })} className="form-input">
                  <option value="Asia/Kathmandu">Asia/Kathmandu (NPT)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                </select>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setRegionalSettings({ ...regionalSettings, dateFormat: 'DD/MM/YYYY' })} className={`btn ${regionalSettings.dateFormat === 'DD/MM/YYYY' ? 'btn-green' : 'btn-blue-outline'}`} style={{ flex: 1 }}>DD/MM/YYYY</button>
                  <button onClick={() => setRegionalSettings({ ...regionalSettings, dateFormat: 'MM/DD/YYYY' })} className={`btn ${regionalSettings.dateFormat === 'MM/DD/YYYY' ? 'btn-green' : 'btn-blue-outline'}`} style={{ flex: 1 }}>MM/DD/YYYY</button>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setShowRegionalModal(false)} className="btn btn-blue-outline" style={{ flex: 1 }}>{t('cancel')}</button>
                  <button onClick={handleRegionalSubmit} className="btn btn-green" style={{ flex: 1 }}>{t('save_settings')}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Sign Out Modal */}
        {showSignOutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSignOutModal(false)} className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} onClick={(e) => e.stopPropagation()} className="modal-content-box" style={{ maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#dc2626', fontSize: '1.75rem' }}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </div>
              <h3>{t('sign_out_confirm')}</h3>
              <p>{t('are_you_sure_sign_out')}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setShowSignOutModal(false)} className="btn btn-blue-outline" style={{ flex: 1 }}>{t('cancel')}</button>
                <button onClick={handleSignOut} className="btn" style={{ flex: 1, background: '#dc2626', color: 'white' }}>{t('sign_out')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          background: white;
        }
        .close-btn {
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }
        .security-btn {
          background: #f8fafc;
          justify-content: flex-start;
          border: 1px solid #e2e8f0;
          padding: 1.25rem 1.5rem;
          border-radius: 14px;
          color: #475569;
        }
      `}</style>
    </div>
  );
};

export default Profile;
